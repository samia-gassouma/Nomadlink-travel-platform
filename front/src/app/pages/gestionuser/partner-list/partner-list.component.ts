import { Component, OnInit } from '@angular/core';
import { Partner } from "../../../services/gestionUser/models/partner";
import { PartnerControllerService } from "../../../services/gestionUser/services/partner-controller.service";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { API_BASE_URL } from "../constants/api";
import {ServiceControllerService} from "../../../services/gestionUser/services/service-controller.service"; // Importez votre constante API_BASE_URL

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss'] // Modification en .scss
})
export class PartnerListComponent implements OnInit {

  // Liste des partenaires
  partners: Partner[] = [];
  filteredPartners: Partner[] = [];
  displayedPartners: Partner[] = [];
  isLoading: boolean = false;
  apiBaseUrl = API_BASE_URL;

  // Contrôles de recherche et filtrage
  searchTerm = new FormControl('');
  searchField = new FormControl('email');
  sortOrder = new FormControl('latestModified');
  partnershipStatusFilter = new FormControl('all');
  enabledStatusFilter = new FormControl('all');
  businessCategoryFilter = new FormControl('all');

  // Liste des catégories d'affaires
  businessCategories: string[] = [
    'HOTEL', 'RESTAURANT', 'TRAVEL_AGENCY', 'TRANSPORT', 'TOURISM', 'FOOD_SUPPLY', 'EVENT_PLANNING', 'RETAIL', 'E_COMMERCE', 'HEALTHCARE', 'FITNESS', 'EDUCATION', 'FINANCIAL_SERVICES', 'TECHNOLOGY', 'CONSTRUCTION', 'LEGAL_SERVICES', 'CONSULTING', 'MEDIA', 'AGRICULTURE', 'MANUFACTURING', 'REAL_ESTATE', 'BEAUTY_AND_WELLNESS', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER'
  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Ajoutez ces propriétés dans la classe
  serviceCountsMap: Map<number, number> = new Map();
  clientCountsMap: Map<number, number> = new Map();

  constructor(
      private partnerService: PartnerControllerService,
      private serviceControllerService: ServiceControllerService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPartners();
    this.loadServiceAndClientCounts();


    // Réagir aux changements de recherche et filtres
    this.searchTerm.valueChanges.subscribe(() => {
      this.currentPage = 1; // Retour à la première page lors d'une recherche
      this.applyFilters();
    });

    this.searchField.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.sortOrder.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.partnershipStatusFilter.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.enabledStatusFilter.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.businessCategoryFilter.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  // Nouvelle méthode pour naviguer vers la création de partenaire
  navigateToCreatePartner(): void {
    this.router.navigate(['/back-office/createpartner']);
  }

  // Nouvelle méthode pour l'URL de l'image du partenaire
  getPartnerImageUrl(partner: Partner): string | null {
    if (partner && partner.profilePicture) {
      return `${this.apiBaseUrl}/uploads/${partner.profilePicture}`;
    }
    return null;
  }

  // Nouvelle méthode pour obtenir les initiales du partenaire comme alternative à l'image
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

  // Nouvelle méthode pour gérer les erreurs d'image
  handleImageError(event: any): void {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;

    // Créer un élément div pour les initiales
    const placeholderDiv = document.createElement('div');
    placeholderDiv.className = 'avatar-placeholder';

    // Trouver le partenaire correspondant pour obtenir les initiales
    const partnerId = Number(parent.getAttribute('data-partner-id'));
    const partner = this.displayedPartners.find(p => p.id === partnerId);

    if (partner) {
      placeholderDiv.textContent = this.getPartnerInitials(partner);
    } else {
      placeholderDiv.textContent = '?';
    }

    parent.appendChild(placeholderDiv);
  }

  loadPartners(): void {
    this.isLoading = true;
    this.partnerService.getAllPartners()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => {
            this.partners = data;
            this.loadServiceAndClientCounts(); // Appeler cette méthode ici
            this.applyFilters();
            console.log('Partners loaded:', this.partners);
          },
          error: (error) => {
            console.error('Error while fetching partners', error);
          }
        });
  }

  applyFilters(): void {
    let result = [...this.partners];

    // Appliquer la recherche
    if (this.searchTerm.value) {
      const term = this.searchTerm.value.toLowerCase();
      const field = this.searchField.value || 'email';

      result = result.filter(partner => {
        switch(field) {
          case 'email':
            return partner.email ? partner.email.toLowerCase().includes(term) : false;
          case 'name':
            return partner.firstname ? partner.firstname.toLowerCase().includes(term) : false;
          case 'site':
            return partner.websiteURL ? partner.websiteURL.toLowerCase().includes(term) : false;
          case 'phoneNumber':
            return partner.phoneNumber ? partner.phoneNumber.toLowerCase().includes(term) : false;
          default:
            return false;
        }
      });
    }

    // Appliquer le filtre de statut de partenariat
    if (this.partnershipStatusFilter.value !== 'all') {
      result = result.filter(partner => partner.partnershipStatus === this.partnershipStatusFilter.value);
    }

    // Appliquer le filtre de statut du compte (enabled/disabled)
    if (this.enabledStatusFilter.value !== 'all') {
      const isEnabled = this.enabledStatusFilter.value === 'active';
      result = result.filter(partner => partner.enabled === isEnabled);
    }

    // Appliquer le filtre de catégorie
    if (this.businessCategoryFilter.value !== 'all') {
      result = result.filter(partner => partner.businessCategory === this.businessCategoryFilter.value);
    }

    // Appliquer le tri
    result.sort((a, b) => {
      switch (this.sortOrder.value) {
        case 'latestModified':
          // Trier par date de dernière modification (du plus récent au plus ancien)
          const dateModA = a.lastModifiedDate || '';
          const dateModB = b.lastModifiedDate || '';
          return dateModA > dateModB ? -1 : 1;

        case 'oldestModified':
          // Trier par date de dernière modification (du plus ancien au plus récent)
          const dateModOldA = a.lastModifiedDate || '';
          const dateModOldB = b.lastModifiedDate || '';
          return dateModOldA < dateModOldB ? -1 : 1;

        case 'latestCreated':
          // Trier par date de création (du plus récent au plus ancien)
          const dateCreateA = a.createdDate || '';
          const dateCreateB = b.createdDate || '';
          return dateCreateA > dateCreateB ? -1 : 1;

        case 'oldestCreated':
          // Trier par date de création (du plus ancien au plus récent)
          const dateCreateOldA = a.createdDate || '';
          const dateCreateOldB = b.createdDate || '';
          return dateCreateOldA < dateCreateOldB ? -1 : 1;

        case 'mostServices':
          return (this.serviceCountsMap.get(b.id!) || 0) - (this.serviceCountsMap.get(a.id!) || 0);

        case 'fewestServices':
          return (this.serviceCountsMap.get(a.id!) || 0) - (this.serviceCountsMap.get(b.id!) || 0);

        case 'mostClients':
          return (this.clientCountsMap.get(b.id!) || 0) - (this.clientCountsMap.get(a.id!) || 0);

        case 'fewestClients':
          return (this.clientCountsMap.get(a.id!) || 0) - (this.clientCountsMap.get(b.id!) || 0);
        default:
          return 0;

      }
    });

    this.filteredPartners = result;
    this.totalPages = Math.ceil(this.filteredPartners.length / this.itemsPerPage);
    this.updateDisplayedPartners();
  }

  updateDisplayedPartners(): void {
    // Calculer l'index de début et de fin pour la pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredPartners.length);

    // Mettre à jour les partenaires affichés
    this.displayedPartners = this.filteredPartners.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedPartners();
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  prevPage(): void {
    this.changePage(this.currentPage - 1);
  }

  getPageArray(): number[] {
    // Créer un tableau pour l'affichage des numéros de page avec limite à 5 pages visibles
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      // Si moins de 5 pages, afficher toutes les pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Sinon, montrer 5 pages centrées autour de la page actuelle
      if (currentPage <= 3) {
        // Premières pages
        return [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        // Dernières pages
        return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Pages du milieu
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
      }
    }
  }

  onEdit(partnerId: number | undefined): void {
    if (partnerId !== undefined) {
      this.router.navigate(['/back-office/partner/update', partnerId]);
    } else {
      console.error('Partner ID is undefined');
    }
  }

  onDelete(partnerId: number | undefined): void {
    if (partnerId === undefined) {
      console.error('Partner ID is undefined');
      return;
    }

    if (confirm('Are you sure you want to delete this partner?')) {
      this.isLoading = true;
      this.partnerService.deletePartner({ id: partnerId })
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: () => {
              console.log('Partner deleted successfully');
              // Reload the partner list after deletion
              this.loadPartners();
            },
            error: (error) => {
              console.error('Error while deleting partner', error);
            }
          });
    }
  }

  onViewDetails(partnerId: number | undefined): void {
    if (partnerId !== undefined) {
      this.router.navigate(['/back-office/partner', partnerId]);
    } else {
      console.error('Partner ID is undefined');
    }
  }

  protected readonly Math = Math;

  resetFilters(): void {
    this.searchTerm.setValue('');
    this.searchField.setValue('email');
    this.sortOrder.setValue('latestModified');
    this.partnershipStatusFilter.setValue('all');
    this.enabledStatusFilter.setValue('all');
    this.businessCategoryFilter.setValue('all');
    this.currentPage = 1;
    this.applyFilters();
  }


  // Méthode qui retourne le nombre de partenaires actifs
  getActivePartnersCount(): number {
    return this.partners.filter(partner => partner.enabled).length;
  }

// Méthode qui retourne le nombre de partenaires inactifs
  getInactivePartnersCount(): number {
    return this.partners.filter(partner => !partner.enabled).length;
  }

// Méthode qui retourne le nombre de partenaires en attente
  getPendingPartnersCount(): number {
    return this.partners.filter(partner => partner.partnershipStatus === 'PENDING').length;
  }


  // Ajoutez ces méthodes
  loadServiceAndClientCounts(): void {
    this.partners.forEach(partner => {
      if (partner.id) {
        this.serviceControllerService.getServiceCountForPartner({ partnerId: partner.id })
            .subscribe(count => {
              this.serviceCountsMap.set(partner.id!, count);
            });

        this.serviceControllerService.getClientCountForPartner({ partnerId: partner.id })
            .subscribe(count => {
              this.clientCountsMap.set(partner.id!, count);
            });
      }
    });
  }

  getServiceCountForPartner(partnerId: number | undefined): number {
    return partnerId ? (this.serviceCountsMap.get(partnerId) || 0) : 0;
  }

  getClientCountForPartner(partnerId: number | undefined): number {
    return partnerId ? (this.clientCountsMap.get(partnerId) || 0) : 0;
  }

  // Méthode pour compter les partenaires par catégorie
  getPartnersCountByCategory(category: string): number {
    return this.partners.filter(partner => partner.businessCategory === category).length;
  }

// Méthode pour obtenir les partenaires les plus populaires (plus de clients)
  getMostPopularPartners(): Partner[] {
    return [...this.partners].sort((a, b) => {
      const aCount = a.id ? (this.clientCountsMap.get(a.id) || 0) : 0;
      const bCount = b.id ? (this.clientCountsMap.get(b.id) || 0) : 0;
      return bCount - aCount; // Tri descendant
    });
  }

// Méthode pour obtenir les partenaires avec le plus de services
  getMostServicePartners(): Partner[] {
    return [...this.partners].sort((a, b) => {
      const aCount = a.id ? (this.serviceCountsMap.get(a.id) || 0) : 0;
      const bCount = b.id ? (this.serviceCountsMap.get(b.id) || 0) : 0;
      return bCount - aCount; // Tri descendant
    });
  }

// Méthode pour obtenir le nombre maximum de clients (pour le calcul des pourcentages)
  getMaxClientCount(): number {
    let max = 0;
    this.partners.forEach(partner => {
      if (partner.id) {
        const count = this.clientCountsMap.get(partner.id) || 0;
        max = Math.max(max, count);
      }
    });
    return max || 1; // Éviter la division par zéro
  }

// Méthode pour obtenir le nombre maximum de services (pour le calcul des pourcentages)
  getMaxServiceCount(): number {
    let max = 0;
    this.partners.forEach(partner => {
      if (partner.id) {
        const count = this.serviceCountsMap.get(partner.id) || 0;
        max = Math.max(max, count);
      }
    });
    return max || 1; // Éviter la division par zéro
  }
}