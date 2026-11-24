import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommandeService } from 'src/app/front-office/services/boutique/commande/commande.service';
import { LivraisonService } from 'src/app/front-office/services/boutique/livraison/livraison.service';

import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutsModule } from 'src/app/back-office/layouts/layouts.module';
import Swal from 'sweetalert2';
import {Commande} from "../../../../../front-office/models/boutique/commande.model";
import {Livraison, StatutLivraison} from "../../../../../front-office/models/boutique/livraison.model";

@Component({
  selector: 'app-adddelivery',
    standalone: true,
    imports: [
      CommonModule,
      NgbCarouselModule,
      LayoutsModule
      ,
      FormsModule,
      ReactiveFormsModule
    ],
  templateUrl: './adddelivery.component.html',
  styleUrls: ['./adddelivery.component.scss']
})

export class AddDeliveryComponent implements OnInit {

  isSidebarHidden: boolean = false;
  commandesNonLivrees: Commande[] = [];
  commandeSelectionnee: Commande | null = null;
  livraisonsEnCours: Livraison[] = [];
  livraisonsLivrees: Livraison[] = [];

  livraisonForm!: FormGroup;
  statuts = Object.values(StatutLivraison);

  constructor(
    private fb: FormBuilder,
    private livraisonService: LivraisonService,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.loadCommandesSansLivraison();
    this.loadLivraisonsEnCours();
    this.initForm();
    this.loadLivraisonsLivrees();
  }

  initForm(): void {
    this.livraisonForm = this.fb.group({
      adresseLivraison: ['', Validators.required],
      dateEstimee: ['', Validators.required],
      statut: ['', Validators.required],
      transporteur: ['']
    });
  }
loadLivraisonsLivrees(): void {
  this.livraisonService.getLivraisonsLivrees().subscribe(data => {
    this.livraisonsLivrees = data;
  });
  
  }
  loadCommandesSansLivraison(): void {
    this.commandeService.getCommandesSansLivraison().subscribe({
      next: (data) => this.commandesNonLivrees = data,
      error: (err) => console.error('Erreur de chargement des commandes :', err)
    });
  }

  loadLivraisonsEnCours(): void {
    this.livraisonService.getLivraisonsEnCours().subscribe({
      next: (data) => {
        console.log("Livraisons récupérées :", data); // Regarde bien si chaque objet a `commande.id`
        this.livraisonsEnCours = data;
      },
      error: (err) => console.error('Erreur chargement livraisons en cours:', err)
    });
  }
  

  selectionnerCommande(commande: Commande): void {
    console.log('Commande sélectionnée :', commande);
    this.commandeSelectionnee = commande;

    // ✅ Ne pas patcher un champ inexistant (commande)
    this.livraisonForm.patchValue({
      adresseLivraison: commande.adresse ?? ''
    });
  }

  creerLivraison(): void {
    if (!this.commandeSelectionnee) {
      console.error("Aucune commande sélectionnée.");
      return;
    }

    if (this.livraisonForm.invalid) {
      console.log("Formulaire invalide !", this.livraisonForm.value);
      return;
    }

    const livraison: Livraison = {
      commande: { id: this.commandeSelectionnee.id! },
      adresseLivraison: this.livraisonForm.value.adresseLivraison,
      dateEstimee: new Date(this.livraisonForm.value.dateEstimee),
      statut: this.livraisonForm.value.statut,
      transporteur: this.livraisonForm.value.transporteur
    };

    console.log("Livraison à envoyer :", livraison);

    this.livraisonService.add(livraison).subscribe({
      next: () => {
        console.log("Livraison créée avec succès");
        this.resetForm();
        this.loadCommandesSansLivraison();
        this.loadLivraisonsEnCours(); // ✅ Recharge les livraisons après ajout
      },
      error: (err) => {
        console.error("Erreur lors de la création de la livraison : ", err);
      }
    });
  }

  resetForm(): void {
    this.livraisonForm.reset();
    this.commandeSelectionnee = null;
  }
  getDateBadgeClass(dateInput: string | Date | undefined): string {
    if (!dateInput) return 'bg-secondary text-white'; // Valeur par défaut si date absente
  
    const today = new Date();
    const date = new Date(dateInput);
    const diff = (date.getTime() - today.getTime()) / (1000 * 3600 * 24);
  
    if (diff < 0) return 'bg-danger text-white';       // 🚨 En retard
    if (diff <= 2) return 'bg-warning text-dark';      // ⚠️ Imminent
    return 'bg-success text-white';                    // ✅ OK
  }
  
  updateLivraisonDate(livraison: Livraison): void {
    if (!livraison.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Identifiant manquant',
        text: 'Identifiant de livraison non défini.'
      });
      return;
    }
  
    if (!livraison.dateLivraisonEffective) {
      Swal.fire({
        icon: 'info',
        title: 'Date manquante',
        text: 'Veuillez sélectionner une date de livraison effective.'
      });
      return;
    }
  
    this.livraisonService.updateLivraison(livraison.id, livraison.dateLivraisonEffective).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Date de livraison mise à jour avec succès !',
          timer: 2000,
          showConfirmButton: false
        });
        this.loadLivraisonsLivrees(); // Recharger les livraisons après mise à jour
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la livraison', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour.'
        });
      }
    });
  }
  
  
}


