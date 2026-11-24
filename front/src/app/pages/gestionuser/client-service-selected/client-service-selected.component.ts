import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { Services } from "../../../services/gestionUser/models/services";
import { User } from "../../../services/gestionUser/models/user";
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-client-service-selected',
  templateUrl: './client-service-selected.component.html',
  styleUrl: './client-service-selected.component.scss'
})
export class ClientServiceSelectedComponent implements OnInit {
  services: Services[] = [];
  client: User | null = null;
  clientId: number | null = null;
  isLoading = false;
  errorMessage = '';
  apiBaseUrl = API_BASE_URL;

  // For filtering and searching
  searchTerm = '';
  selectedCategory = '';

  // For sorting
  sortBy = 'none';
  sortOrder: 'asc' | 'desc' = 'asc';

  // For pagination
  itemsPerPage = 8;
  currentPage = 1;
  displayedServices: Services[] = [];

  // Service categories for filter
  serviceCategories = [
    'ACCOMMODATION', 'TRANSPORT', 'TOUR_GUIDE', 'ACTIVITY',
    'RESTAURANT', 'WELLNESS', 'ENTERTAINMENT', 'SHOPPING',
    'ADVENTURE', 'EVENT', 'SPORTS', 'CRUISE', 'CULTURE',
    'EQUIPMENT_RENTAL', 'TRAVEL_INSURANCE', 'OTHER'
  ];

  // Sorting options
  sortOptions = [
    { value: 'none', label: 'No Sorting' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price', label: 'Price' },
    { value: 'date', label: 'Date (Newest First)' }
  ];

  constructor(
      private serviceController: ServiceControllerService,
      private route: ActivatedRoute,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clientId = +params['clientId']; // Convert string to number with the + operator
      if (this.clientId) {
        this.loadClientServices(this.clientId);
      } else {
        this.errorMessage = 'Client ID not provided';
      }
    });
  }

  loadClientServices(clientId: number): void {
    this.isLoading = true;

    // Get selected services of the user
    this.serviceController.getSelectedServicesOfUser({ userId: clientId })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(
            services => {
              this.services = services;
              console.log('Client services loaded:', services);
              this.updateDisplayedServices();
            },
            error => {
              console.error('Error loading client services', error);
              this.errorMessage = 'Unable to load client services. Please try again.';
            }
        );
  }

  // Filter for search and category
  get filteredServices(): Services[] {
    let result = this.services.filter(service => {
      // Filter by search term
      const matchesSearch = !this.searchTerm ||
          service.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filter by category
      const matchesCategory = !this.selectedCategory || service.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    result = this.sortServices(result);

    return result;
  }

  // Sort services based on selected criteria
  sortServices(services: Services[]): Services[] {
    if (this.sortBy === 'none') return services;

    return [...services].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = this.compareValues(a.name, b.name);
          break;
        case 'price':
          comparison = this.compareValues(a.price, b.price);
          break;
        case 'date':
          // Using ID as proxy for creation date (higher ID = newer)
          comparison = this.compareValues(b.id, a.id); // Note: reversed to show newest first
          break;
      }

      // Apply sort order (asc/desc)
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // Helper method for comparing values safely
  compareValues(a: any, b: any): number {
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return -1;
    if (b === undefined) return 1;

    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }

    return a - b;
  }

  // Toggle sort order when clicking on the same sorting option
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.updateDisplayedServices();
  }

  // Change sorting criteria
  changeSortBy(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.toggleSortOrder();
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.updateDisplayedServices();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.sortBy = 'none';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.updateDisplayedServices();
  }

  // Pagination
  pageChanged(page: number): void {
    this.currentPage = page;
    this.updateDisplayedServices();
  }

  updateDisplayedServices(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedServices = this.filteredServices.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getIconForCategory(category?: string): string {
    if (!category) return 'fa-question';

    switch (category) {
      case 'ACCOMMODATION':
        return 'fa-hotel';
      case 'TRANSPORT':
        return 'fa-car';
      case 'TOUR_GUIDE':
        return 'fa-map';
      case 'ACTIVITY':
        return 'fa-hiking';
      case 'RESTAURANT':
        return 'fa-utensils';
      case 'WELLNESS':
        return 'fa-spa';
      case 'ENTERTAINMENT':
        return 'fa-ticket-alt';
      case 'SHOPPING':
        return 'fa-shopping-cart';
      case 'ADVENTURE':
        return 'fa-mountain';
      case 'EVENT':
        return 'fa-calendar-alt';
      case 'SPORTS':
        return 'fa-running';
      case 'CRUISE':
        return 'fa-ship';
      case 'CULTURE':
        return 'fa-landmark';
      case 'EQUIPMENT_RENTAL':
        return 'fa-tools';
      case 'TRAVEL_INSURANCE':
        return 'fa-umbrella';
      case 'OTHER':
      default:
        return 'fa-question';
    }
  }

  getServiceImageUrl(imagePath: string | undefined): string | null {
    if (!imagePath) {
      return null;
    }
    return `${this.apiBaseUrl}/uploads/${imagePath}`;
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }

  viewServiceDetails(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      this.errorMessage = 'Service ID not defined';
      return;
    }
    this.router.navigate(['/front-office/service-details', serviceId]);
  }

  goBack(): void {
    this.router.navigate(['/front-office/myprofilepartner']);
  }

  protected readonly Math = Math;
}