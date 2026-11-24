import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { PartnerControllerService } from "../../../services/gestionUser/services/partner-controller.service";
import { Services } from "../../../services/gestionUser/models/services";
import { Partner } from "../../../services/gestionUser/models/partner";
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-active-partner-services',
  templateUrl: './active-partner-services.component.html',
  styleUrls: ['./active-partner-services.component.scss']
})
export class ActivePartnerServicesComponent implements OnInit {
  services: Services[] = [];
  currentUserId: number | null = null;
  isLoading = false;
  errorMessage = '';
  apiBaseUrl = API_BASE_URL;
  selectedServices: number[] = [];

  // For filtering and searching
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

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

  // Status options
  statusOptions = ['DISPONIBLE', 'INDISPONIBLE'];

  // Sorting options
  sortOptions = [
    { value: 'none', label: 'No Sorting' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price', label: 'Price' },
    { value: 'partner', label: 'Partner Name' }
  ];

  constructor(
      private serviceController: ServiceControllerService,
      private partnerService: PartnerControllerService,
      private currentuserService: CurrentuserService,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAllServices();
  }

  loadCurrentUser(): void {
    this.currentuserService.getCurrentUserId()
        .subscribe(
            userId => {
              this.currentUserId = userId;
              if (userId) {
                this.loadSelectedServices(userId);
              }
            },
            error => {
              console.error('Error retrieving user', error);
            }
        );
  }

  loadSelectedServices(userId: number): void {
    this.serviceController.getSelectedServicesOfUser({ userId })
        .subscribe(
            services => {
              this.selectedServices = services.map(service => service.id || 0).filter(id => id !== 0);
              console.log('Selected services loaded:', this.selectedServices);
            },
            error => {
              console.error('Error loading selected services', error);
            }
        );
  }

  loadAllServices(): void {
    this.isLoading = true;
    this.serviceController.getAllServices()
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(
            services => {
              // Only keep services from active partners
              this.filterActivePartnerServices(services);
            },
            error => {
              console.error('Error loading services', error);
              this.errorMessage = 'Unable to load services. Please try again.';
            }
        );
  }

  filterActivePartnerServices(allServices: Services[]): void {
    // First get all active partners
    this.partnerService.getAllPartners()
        .subscribe(
            partners => {
              const activePartnerIds = partners
                  .filter(partner => partner.partnershipStatus === 'ACTIVE' && partner.enabled === true)
                  .map(partner => partner.id);

              // Filter services to only include those from active partners
              this.services = allServices.filter(service =>
                  service.partner?.id && activePartnerIds.includes(service.partner.id)
              );

              console.log('Active partner services loaded:', this.services);
              this.updateDisplayedServices();
            },
            error => {
              console.error('Error loading partners', error);
              this.errorMessage = 'Unable to filter services by active partners.';
            }
        );
  }

  selectService(serviceId: number | undefined): void {
    if (!serviceId || !this.currentUserId) {
      console.error('Service ID or User ID not defined');
      this.errorMessage = 'You must be logged in to select services';
      return;
    }

    this.isLoading = true;
    this.serviceController.selectService({ serviceId, userId: this.currentUserId })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(
            () => {
              console.log('Service successfully selected');
              this.selectedServices.push(serviceId);
            },
            error => {
              console.error('Error selecting service', error);
              this.errorMessage = 'Unable to select service. Please try again.';
            }
        );
  }

  deselectService(serviceId: number | undefined): void {
    if (!serviceId || !this.currentUserId) {
      console.error('Service ID or User ID not defined');
      this.errorMessage = 'You must be logged in to deselect services';
      return;
    }

    this.isLoading = true;
    this.serviceController.deselectService({ serviceId, userId: this.currentUserId })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(
            () => {
              console.log('Service successfully deselected');
              this.selectedServices = this.selectedServices.filter(id => id !== serviceId);
            },
            error => {
              console.error('Error deselecting service', error);
              this.errorMessage = 'Unable to deselect service. Please try again.';
            }
        );
  }

  isServiceSelected(serviceId: number | undefined): boolean {
    return serviceId !== undefined && this.selectedServices.includes(serviceId);
  }

  viewServiceDetails(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      this.errorMessage = 'Service ID not defined';
      return;
    }
    this.router.navigate(['/front-office/service-details', serviceId]);
  }

  viewPartnerDetails(partnerId: number | undefined): void {
    if (partnerId === undefined) {
      console.error('Partner ID not defined');
      this.errorMessage = 'Partner ID not defined';
      return;
    }
    this.router.navigate(['/front-office/partnerdetail', partnerId]);
  }

  // Filter for search, category, and status
  get filteredServices(): Services[] {
    let result = this.services.filter(service => {
      // Filter by search term
      const matchesSearch = !this.searchTerm ||
          service.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.partner?.firstname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.partner?.lastname?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filter by category
      const matchesCategory = !this.selectedCategory || service.category === this.selectedCategory;

      // Filter by status
      const matchesStatus = !this.selectedStatus || service.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
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
        case 'partner':
          const aName = `${a.partner?.firstname || ''} ${a.partner?.lastname || ''}`.trim();
          const bName = `${b.partner?.firstname || ''} ${b.partner?.lastname || ''}`.trim();
          comparison = this.compareValues(aName, bName);
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
    this.selectedStatus = '';
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

  // handleImageError(event: any): void {
  //   event.target.style.display = 'none';
  //   event.target.nextElementSibling.style.display = 'flex';
  // }
  handleImageError(event: any): void {
    // Hide the failed image
    event.target.style.display = 'none';

    // Check if there's a next sibling element before trying to access its style
    const nextSibling = event.target.nextElementSibling;
    if (nextSibling) {
      nextSibling.style.display = 'flex';
    } else {
      // If there's no next sibling, create a placeholder
      const parent = event.target.parentElement;
      const placeholderDiv = document.createElement('div');
      placeholderDiv.className = 'placeholder-img';
      const icon = document.createElement('i');
      // Use a generic icon or retrieve the appropriate one based on service category
      icon.className = 'fas fa-image';
      placeholderDiv.appendChild(icon);
      parent.appendChild(placeholderDiv);
    }
  }

  // Get partner name for display
  getPartnerName(partner?: Partner): string {
    if (!partner) return 'Unknown Partner';
    return `${partner.firstname || ''} ${partner.lastname || ''}`.trim() || 'Unknown Partner';
  }

  // Get partner initials for avatar fallback
  getPartnerInitials(partner?: Partner): string {
    let initials = '';
    if (partner?.firstname) {
      initials += partner.firstname.charAt(0).toUpperCase();
    }
    if (partner?.lastname) {
      initials += partner.lastname.charAt(0).toUpperCase();
    }
    return initials || '?';
  }

  getPartnerImageUrl(partner: Partner | undefined): string | null {
    if (partner && partner.profilePicture) {
      return `${this.apiBaseUrl}/uploads/${partner.profilePicture}`;
    }
    return null;
  }

  handlePartnerImageError(event: any, partner?: Partner): void {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;

    // Check if a placeholder exists already
    const existingPlaceholder = parent.querySelector('.avatar-placeholder');
    if (existingPlaceholder) {
      return;
    }

    // Create div element for initials
    const placeholderDiv = document.createElement('div');
    placeholderDiv.className = 'avatar-placeholder';
    placeholderDiv.textContent = this.getPartnerInitials(partner);

    parent.appendChild(placeholderDiv);
  }

  protected readonly Math = Math;
}