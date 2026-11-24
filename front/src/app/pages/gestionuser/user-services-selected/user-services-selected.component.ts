import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { UserControllerService } from "../../../services/gestionUser/services/user-controller.service";
import { Services } from "../../../services/gestionUser/models/services";
import { User } from "../../../services/gestionUser/models/user";
import { API_BASE_URL } from "../constants/api";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-user-services-selected',
  templateUrl: './user-services-selected.component.html',
  styleUrls: ['./user-services-selected.component.scss']
})
export class UserServicesSelectedComponent implements OnInit {
  services: Services[] = [];
  filteredServices: Services[] = [];
  displayedServices: Services[] = [];
  user: User | null = null;
  userId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  apiBaseUrl = API_BASE_URL;

  // Contrôles de recherche et filtrage
  searchTerm = new FormControl('');
  searchField = new FormControl('name');
  sortOrder = new FormControl('latestAdded');
  categoryFilter = new FormControl('all');

  // Catégories de services
  serviceCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'ACCOMMODATION', label: 'Accommodation' },
    { value: 'TRANSPORT', label: 'Transport' },
    { value: 'TOUR_GUIDE', label: 'Tour Guide' },
    { value: 'ACTIVITY', label: 'Activity' },
    { value: 'RESTAURANT', label: 'Restaurant' },
    { value: 'WELLNESS', label: 'Wellness' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'SHOPPING', label: 'Shopping' },
    { value: 'ADVENTURE', label: 'Adventure' },
    { value: 'EVENT', label: 'Event' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'CRUISE', label: 'Cruise' },
    { value: 'CULTURE', label: 'Culture' },
    { value: 'EQUIPMENT_RENTAL', label: 'Equipment Rental' },
    { value: 'TRAVEL_INSURANCE', label: 'Travel Insurance' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Options de tri
  sortOptions = [
    { value: 'latestAdded', label: 'Latest Added' },
    { value: 'oldestAdded', label: 'Oldest Added' },
    { value: 'nameAsc', label: 'Name (A-Z)' },
    { value: 'nameDesc', label: 'Name (Z-A)' },
    { value: 'priceAsc', label: 'Price (Low to High)' },
    { value: 'priceDesc', label: 'Price (High to Low)' }
  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
      private serviceController: ServiceControllerService,
      private userService: UserControllerService,
      private route: ActivatedRoute,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Convert string to number
      if (this.userId) {
        this.loadUserDetails();
        this.loadUserServices();
      } else {
        this.errorMessage = 'Invalid user ID';
      }
    });

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

    this.categoryFilter.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  loadUserDetails(): void {
    if (!this.userId) return;

    this.userService.getUserDetailsById({ id: this.userId })
        .subscribe({
          next: (userData) => {
            this.user = userData;
            console.log('User data loaded:', userData);
          },
          error: (error) => {
            console.error('Error loading user details', error);
            this.errorMessage = 'Unable to load user details';
          }
        });
  }

  loadUserServices(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.serviceController.getSelectedServicesOfUser({ userId: this.userId })
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => {
            this.services = data;
            this.applyFilters();
            console.log('User services loaded:', this.services);
          },
          error: (error) => {
            console.error('Error loading user services', error);
            this.errorMessage = 'Unable to load user services';
          }
        });
  }

  applyFilters(): void {
    let result = [...this.services];

    // Appliquer la recherche
    if (this.searchTerm.value) {
      const term = this.searchTerm.value.toLowerCase();
      const field = this.searchField.value || 'name';

      result = result.filter(service => {
        switch(field) {
          case 'name':
            return service.name ? service.name.toLowerCase().includes(term) : false;
          case 'description':
            return service.description ? service.description.toLowerCase().includes(term) : false;
          case 'category':
            return service.category ? service.category.toLowerCase().includes(term) : false;
          default:
            return false;
        }
      });
    }

    // Appliquer le filtre de catégorie
    if (this.categoryFilter.value !== 'all') {
      result = result.filter(service => service.category === this.categoryFilter.value);
    }

    // Appliquer le tri
    result.sort((a, b) => {
      switch (this.sortOrder.value) {
        case 'latestAdded':
          // Utiliser l'ID comme proxy pour la date d'ajout (ID plus élevé = plus récent)
          return (b.id || 0) - (a.id || 0);
        case 'oldestAdded':
          return (a.id || 0) - (b.id || 0);
        case 'nameAsc':
          return (a.name || '').localeCompare(b.name || '');
        case 'nameDesc':
          return (b.name || '').localeCompare(a.name || '');
        case 'priceAsc':
          return (a.price || 0) - (b.price || 0);
        case 'priceDesc':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    this.filteredServices = result;
    this.totalPages = Math.ceil(this.filteredServices.length / this.itemsPerPage);
    this.updateDisplayedServices();
  }

  updateDisplayedServices(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredServices.length);
    this.displayedServices = this.filteredServices.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedServices();
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  prevPage(): void {
    this.changePage(this.currentPage - 1);
  }

  getPageArray(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
      }
    }
  }

  getIconForCategory(category?: string): string {
    if (!category) return 'fa-question';

    switch (category) {
      case 'ACCOMMODATION': return 'fa-hotel';
      case 'TRANSPORT': return 'fa-car';
      case 'TOUR_GUIDE': return 'fa-map';
      case 'ACTIVITY': return 'fa-hiking';
      case 'RESTAURANT': return 'fa-utensils';
      case 'WELLNESS': return 'fa-spa';
      case 'ENTERTAINMENT': return 'fa-ticket-alt';
      case 'SHOPPING': return 'fa-shopping-cart';
      case 'ADVENTURE': return 'fa-mountain';
      case 'EVENT': return 'fa-calendar-alt';
      case 'SPORTS': return 'fa-running';
      case 'CRUISE': return 'fa-ship';
      case 'CULTURE': return 'fa-landmark';
      case 'EQUIPMENT_RENTAL': return 'fa-tools';
      case 'TRAVEL_INSURANCE': return 'fa-umbrella';
      case 'OTHER':
      default: return 'fa-question';
    }
  }

  getServiceImageUrl(imagePath: string | undefined): string | null {
    if (!imagePath) return null;
    return `${this.apiBaseUrl}/uploads/${imagePath}`;
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
    // Afficher un placeholder à la place
    const parent = event.target.parentElement;
    const serviceId = parent.getAttribute('data-service-id');
    const service = this.displayedServices.find(s => s.id === +serviceId);

    const iconDiv = document.createElement('div');
    iconDiv.className = 'service-icon-placeholder';
    iconDiv.innerHTML = `<i class="fas ${this.getIconForCategory(service?.category)}"></i>`;

    parent.appendChild(iconDiv);
  }

  navigateBack(): void {
    this.router.navigate(['/back-office/user', this.userId]);
  }

  viewServiceDetails(serviceId: number | undefined): void {
    if (serviceId === undefined) return;
    this.router.navigate(['/back-office/service-details', serviceId]);
  }

  protected readonly Math = Math;

  resetFilters(): void {
    this.searchTerm.setValue('');
    this.searchField.setValue('name');
    this.sortOrder.setValue('latestAdded');
    this.categoryFilter.setValue('all');
    this.currentPage = 1;
    this.applyFilters();
  }
}