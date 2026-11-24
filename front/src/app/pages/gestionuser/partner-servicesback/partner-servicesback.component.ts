import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ServiceControllerService } from '../../../services/gestionUser/services/service-controller.service';
import { PartnerControllerService } from '../../../services/gestionUser/services/partner-controller.service';
import { Services } from '../../../services/gestionUser/models/services';
import { Partner } from '../../../services/gestionUser/models/partner';
import { API_BASE_URL } from '../constants/api';
@Component({
  selector: 'app-partner-servicesback',
  templateUrl: './partner-servicesback.component.html',
  styleUrl: './partner-servicesback.component.scss'
})
export class PartnerServicesbackComponent implements OnInit {
  services: Services[] = [];
  filteredServices: Services[] = [];
  displayedServices: Services[] = [];
  partner: Partner | null = null;
  partnerId: number | null = null;
  isLoading = false;
  errorMessage = '';
  apiBaseUrl = API_BASE_URL;

  // Search and filter controls
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  // Service categories for filter
  serviceCategories = [
    'ACCOMMODATION', 'TRANSPORT', 'TOUR_GUIDE', 'ACTIVITY',
    'RESTAURANT', 'WELLNESS', 'ENTERTAINMENT', 'SHOPPING',
    'ADVENTURE', 'EVENT', 'SPORTS', 'CRUISE', 'CULTURE',
    'EQUIPMENT_RENTAL', 'TRAVEL_INSURANCE', 'OTHER'
  ];

  // Status options
  statusOptions = ['DISPONIBLE', 'INDISPONIBLE'];

  // Sorting
  sortBy = 'none';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortOptions = [
    { value: 'none', label: 'No Sorting' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price', label: 'Price' },
    { value: 'date', label: 'Date (Newest First)' }
  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private serviceController: ServiceControllerService,
      private partnerService: PartnerControllerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam && !isNaN(+idParam)) {
        this.partnerId = +idParam;
        this.loadPartnerDetails();
        this.loadPartnerServices();
      } else {
        this.errorMessage = 'Invalid partner ID';
      }
    });
  }

  loadPartnerDetails(): void {
    if (!this.partnerId) return;

    this.isLoading = true;
    this.partnerService.getPartnerById({ id: this.partnerId })
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe({
          next: (data) => {
            this.partner = data;
          },
          error: (error) => {
            console.error('Error loading partner details:', error);
            this.errorMessage = 'Failed to load partner details';
          }
        });
  }

  loadPartnerServices(): void {
    if (!this.partnerId) return;

    this.isLoading = true;
    this.serviceController.getAllServicesOfPartner({ partnerId: this.partnerId })
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe({
          next: (data) => {
            this.services = data;
            this.applyFilters();
          },
          error: (error) => {
            console.error('Error loading partner services:', error);
            this.errorMessage = 'Failed to load partner services';
          }
        });
  }

  applyFilters(): void {
    let result = [...this.services];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(service =>
          (service.name?.toLowerCase().includes(term) || false) ||
          (service.description?.toLowerCase().includes(term) || false)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      result = result.filter(service => service.category === this.selectedCategory);
    }

    // Apply status filter
    if (this.selectedStatus) {
      result = result.filter(service => service.status === this.selectedStatus);
    }

    // Apply sorting
    result = this.sortServices(result);

    this.filteredServices = result;
    this.totalPages = Math.ceil(this.filteredServices.length / this.itemsPerPage);
    this.updateDisplayedServices();
  }

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
          comparison = this.compareValues(b.id, a.id); // Reversed to show newest first
          break;
      }

      // Apply sort order
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  compareValues(a: any, b: any): number {
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return -1;
    if (b === undefined) return 1;

    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }

    return a - b;
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

  changeSortBy(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.toggleSortOrder();
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.sortBy = 'none';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.applyFilters();
  }

  viewServiceDetails(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      return;
    }
    this.router.navigate(['/back-office/service-details', serviceId]);
  }

  deleteService(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      return;
    }

    if (confirm('Are you sure you want to delete this service?')) {
      this.isLoading = true;
      this.serviceController.deleteService({ id: serviceId })
          .pipe(finalize(() => {
            this.isLoading = false;
          }))
          .subscribe({
            next: () => {
              this.services = this.services.filter(service => service.id !== serviceId);
              this.applyFilters();
            },
            error: (error) => {
              console.error('Error deleting service:', error);
              this.errorMessage = 'Failed to delete service';
            }
          });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/back-office/partner', this.partnerId]);
  }

  getServiceImageUrl(imagePath: string | undefined): string | null {
    if (!imagePath) {
      return null;
    }
    return `${this.apiBaseUrl}/uploads/${imagePath}`;
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;

    if (parent.querySelector('.image-placeholder')) {
      parent.querySelector('.image-placeholder').style.display = 'flex';
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

  protected readonly Math = Math;
}