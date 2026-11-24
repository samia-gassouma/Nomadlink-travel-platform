import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutsModule } from 'src/app/back-office/layouts/layouts.module';

import { CommandeService } from 'src/app/front-office/services/boutique/commande/commande.service';

import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Commande } from 'src/app/front-office/models/boutique/commande.model';

@Component({
  selector: 'app-listorder',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    LayoutsModule,
    FormsModule
  ],
  templateUrl: './listorder.component.html',
  styleUrl: './listorder.component.scss'
})
export class ListorderComponent implements OnInit {
  isSidebarHidden: boolean = false;
  commandes: Commande[] = [];
  commandesOriginales: Commande[] = []; 
  motCleRecherche: string = '';
  commandeSelectionnee?: Commande;
  currentPageCommande: number = 1;
  itemsPerPageCommande: number = 5;
  
  
  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
    this.commandeService.getCommandes().subscribe(data => {
      this.commandesOriginales = data;
      this.commandes = [...data];
    });
  }
  filtrerCommandes(statut: string): void {
    if (statut === 'TOUTES') {
      this.commandes = [...this.commandesOriginales];
    } else {
      this.commandes = this.commandesOriginales.filter(c => c.statut === statut);
    }
  }
  rechercherCommandes(): void {
    const motCle = this.motCleRecherche.trim().toLowerCase();
  
    if (!motCle) {
      this.commandes = [...this.commandesOriginales];
      return;
    }
  
    this.commandes = this.commandesOriginales.filter(cmd => {
      return (
        cmd.nom.toLowerCase().includes(motCle) ||
        cmd.prenom.toLowerCase().includes(motCle) ||
        cmd.telephone.toLowerCase().includes(motCle) ||
        cmd.lignesCommande.some(ligne =>
          ligne.produit?.nom?.toLowerCase().includes(motCle)
        )
      );
    });
  }
  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  loadCommandes(): void {
    this.commandeService.getCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes :', err);
      }
    });
  }

  getTotal(commande: Commande): number {
    return commande.lignesCommande.reduce(
      (total, ligne) => total + ligne.quantite * ligne.prixUnitaire,
      0
    );
  }

  // Action: afficher les détails dans un popup
  viewDetail(commande: Commande): void {
    const detailsProduits = commande.lignesCommande.map(ligne => {
      const image = ligne.produit.images?.[0]?.image;
      const imgTag = image
        ? `<img src="data:image/jpeg;base64,${image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px; margin-right: 8px;">`
        : `<img src="assets/images/no-image.png" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px; margin-right: 8px;">`;
  
      return `
        <tr>
          <td style="display: flex; align-items: center;">${imgTag}${ligne.produit.nom || 'Produit'}</td>
          <td style="text-align: center;">${ligne.quantite}</td>
          <td style="text-align: center;">${ligne.prixUnitaire.toFixed(2)} TND</td>
          <td style="text-align: center;">${(ligne.quantite * ligne.prixUnitaire).toFixed(2)} TND</td>
        </tr>
      `;
    }).join('');
  
    const statutOptions = ['LIVREE', 'EN_PREPARATION', 'ANNULEE', 'EN_ATTENTE'].map(statut => {
      const selected = commande.statut === statut ? 'selected' : '';
      return `<option value="${statut}" ${selected}>${statut}</option>`;
    }).join('');
  
    const htmlContent = `
      <div id="facture-content" style="text-align: left; font-size: 14px;">
        <p><strong>👤 Client:</strong> ${commande.nom} ${commande.prenom}</p>
        <p><strong>📞 Téléphone:</strong> ${commande.telephone}</p>
        <p><strong>📍 Adresse:</strong> ${commande.adresse}</p>
        <p><strong>📅 Date:</strong> ${new Date(commande.dateCommande).toLocaleDateString()}</p>
        <p><strong>📦 Statut:</strong> 
          <select id="statutSelect" style="padding: 2px 5px; font-size: 13px;">
            ${statutOptions}
          </select>
        </p>
        <hr>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;" border="1">
          <thead style="background-color: #f8f9fa;">
            <tr>
              <th style="padding: 6px;">Produit</th>
              <th style="padding: 6px;">Quantité</th>
              <th style="padding: 6px;">Prix unitaire</th>
              <th style="padding: 6px;">Sous-total</th>
            </tr>
          </thead>
          <tbody>
            ${detailsProduits}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right; padding: 8px;"><strong>Total :</strong></td>
              <td style="text-align: center; font-weight: bold;">${this.getTotal(commande).toFixed(2)} TND</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  
    Swal.fire({
      title: `
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <strong>🧾 Facture - Commande n°${commande.id}</strong>
    <button onclick="window.print()" style="background: none; border: none; cursor: pointer;" title="Imprimer">
      <i class="ri-printer-line" style="font-size: 18px;"></i>
    </button>
  </div>
`,

      width: 850,
      html: htmlContent,
      showCancelButton: true,
      showDenyButton: true,
      cancelButtonText: 'Fermer',
      confirmButtonText: 'Imprimer',
      denyButtonText: 'Enregistrer statut',
      preDeny: () => {
        const nouveauStatut = (document.getElementById('statutSelect') as HTMLSelectElement)?.value;
        if (nouveauStatut && nouveauStatut !== commande.statut) {
          const updatedCommande = { ...commande, statut: nouveauStatut };
          this.commandeService.updateCommande(updatedCommande).subscribe({
            next: () => {
              this.mettreAJourCommande(updatedCommande);
              Swal.fire('Mis à jour', `Le statut a été modifié.`, 'success');
            },
            error: () => Swal.fire('Erreur', 'Impossible de modifier le statut.', 'error')
          });
        }
      },
      preConfirm: () => {
        const factureHTML = document.getElementById('facture-content')?.outerHTML;
        const win = window.open('', '_blank');
        if (win && factureHTML) {
          win.document.write(`
            <html>
              <head>
                <title>Facture Commande #${commande.id}</title>
                <style>
                  body { font-family: Arial; padding: 20px; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { padding: 6px; border: 1px solid #ccc; }
                </style>
              </head>
              <body>${factureHTML}</body>
            </html>
          `);
          win.document.close();
          win.print();
        }
      }
    });
  }
  
  mettreAJourCommande(updatedCommande: Commande): void {
    this.commandeService.updateCommande(updatedCommande).subscribe({
      next: (data) => {
        console.log('Commande mise à jour côté backend :', data);
        const index = this.commandes.findIndex(c => c.id === updatedCommande.id);
        if (index !== -1) {
          this.commandes[index] = { ...data };
        }
        this.commandeSelectionnee = undefined;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la commande :', err);
      }
    });
  }
  
  imprimerFacture(): void {
    window.print();
  }
  

// Action: modifier une commande (affiche les infos modifiables pour l'instant)
editCommande(commande: Commande): void {
  Swal.fire({
    title: `Modifier la commande`,
    html: `
      <p><strong>Client:</strong> ${commande.nom} ${commande.prenom}</p>
      <p><strong>Téléphone:</strong> ${commande.telephone}</p>
      <p><strong>Statut actuel:</strong> ${commande.statut}</p>
    `,
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler',
    preConfirm: () => {
     
      return true;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Mis à jour', 'Les modifications ont été enregistrées.', 'success');
    
    }
  });
}


  // Action: supprimer une commande avec confirmation
  deleteCommande(commande: Commande): void {
    Swal.fire({
      title: 'Supprimer la commande ?',
      text: `Commande de ${commande.nom} ${commande.prenom}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commandeService.deleteCommande(commande.id!).subscribe({
          next: () => {
            Swal.fire('Supprimée !', 'La commande a été supprimée.', 'success');
            this.loadCommandes(); // Recharge la liste après suppression
          },
          error: (err) => {
            console.error('Erreur lors de la suppression :', err);
            Swal.fire('Erreur', 'Impossible de supprimer la commande.', 'error');
          }
        });
      }
    });
  }
  
  get paginatedCommandes() {
    const start = (this.currentPageCommande - 1) * this.itemsPerPageCommande;
    const end = start + this.itemsPerPageCommande;
    return this.commandes.slice(start, end);
  }
  
  get totalCommandePages(): number[] {
    return Array(Math.ceil(this.commandes.length / this.itemsPerPageCommande))
      .fill(0)
      .map((_, i) => i + 1);
  }
  
  setCommandePage(page: number) {
    if (page >= 1 && page <= this.totalCommandePages.length) {
      this.currentPageCommande = page;
      window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll fluide vers le haut
    }
  }
  
}
