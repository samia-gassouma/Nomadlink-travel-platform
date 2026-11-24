import { Component, OnInit } from '@angular/core';
import { Partner } from "../../../services/gestionUser/models/partner";
import { PartnerControllerService } from "../../../services/gestionUser/services/partner-controller.service";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-active-partners',
  templateUrl: './active-partners.component.html',
  styleUrls: ['./active-partners.component.scss']
})
export class ActivePartnersComponent implements OnInit {

  // Liste des partenaires actifs
  activePartners: Partner[] = [];
  isLoading: boolean = false;
  apiBaseUrl = API_BASE_URL;

  // Variables pour le design responsive
  displayedColumns = 3; // Nombre de colonnes par défaut

  // For pagination
  itemsPerPage = 6; // Number of partners per page
  currentPage = 1;
  displayedPartners: Partner[] = [];
  constructor(
      private partnerService: PartnerControllerService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadActivePartners();
    this.adjustColumnsForScreenSize();

    // Ajuster les colonnes quand la fenêtre est redimensionnée
    window.addEventListener('resize', () => {
      this.adjustColumnsForScreenSize();
    });

    this.updateDisplayedPartners();

  }

  updateDisplayedPartners(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedPartners = this.activePartners.slice(startIndex, startIndex + this.itemsPerPage);
  }

  pageChanged(page: number): void {
    this.currentPage = page;
    this.updateDisplayedPartners();
  }

  // Ajuster le nombre de colonnes en fonction de la taille de l'écran
  adjustColumnsForScreenSize(): void {
    const width = window.innerWidth;
    if (width < 576) {
      this.displayedColumns = 1; // Mobile - une colonne
    } else if (width < 992) {
      this.displayedColumns = 2; // Tablette - deux colonnes
    } else {
      this.displayedColumns = 3; // Desktop - trois colonnes
    }
  }

  loadActivePartners(): void {
    this.isLoading = true;
    this.partnerService.getAllPartners()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => {
            // Filtrer pour ne garder que les partenaires actifs
            this.activePartners = data.filter(partner =>
                partner.partnershipStatus === 'ACTIVE' && partner.enabled === true
            );
            console.log('Active partners loaded:', this.activePartners);
            this.updateDisplayedPartners(); // Update the displayed partners after loading

          },
          error: (error) => {
            console.error('Error while fetching active partners', error);
          }
        });
  }

  // Méthode pour l'URL de l'image du partenaire
  getPartnerImageUrl(partner: Partner): string | null {
    if (partner && partner.profilePicture) {
      return `${this.apiBaseUrl}/uploads/${partner.profilePicture}`;
    }
    return null;
  }

  // Méthode pour obtenir les initiales du partenaire comme alternative à l'image
  getPartnerInitials(partner: Partner): string {
    let initials = '';
    if (partner.firstname) {
      initials += partner.firstname.charAt(0).toUpperCase();
    }
    if (partner.lastname) {
      initials += partner.lastname.charAt(0).toUpperCase();
    }
    return initials || '?';
  }

  // Méthode pour gérer les erreurs d'image
  handleImageError(event: any, partner: Partner): void {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;

    // Vérifier si un placeholder existe déjà
    const existingPlaceholder = parent.querySelector('.avatar-placeholder');
    if (existingPlaceholder) {
      return;
    }

    // Créer un élément div pour les initiales
    const placeholderDiv = document.createElement('div');
    placeholderDiv.className = 'avatar-placeholder';
    placeholderDiv.textContent = this.getPartnerInitials(partner);

    parent.appendChild(placeholderDiv);
  }

  // Naviguer vers les détails du partenaire
  viewPartnerDetails(partnerId: number | undefined): void {
    if (partnerId !== undefined) {
      this.router.navigate(['/front-office/partnerdetail', partnerId]);
    }
  }

  // Obtenir les chunks (groupes) de partenaires pour l'affichage en grille
  getPartnerChunks(): Array<Partner[]> {
    const chunks: Array<Partner[]> = [];
    const chunkSize = this.displayedColumns;

    for (let i = 0; i < this.activePartners.length; i += chunkSize) {
      chunks.push(this.activePartners.slice(i, i + chunkSize));
    }

    return chunks;
  }

  protected readonly Math = Math;
}