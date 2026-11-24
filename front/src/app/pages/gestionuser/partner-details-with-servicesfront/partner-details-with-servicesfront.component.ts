import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Partner } from '../../../services/gestionUser/models/partner';
import { Services } from '../../../services/gestionUser/models/services';
import { PartnerControllerService } from '../../../services/gestionUser/services/partner-controller.service';
import { ServiceControllerService } from '../../../services/gestionUser/services/service-controller.service';
import { API_BASE_URL } from '../constants/api';
import {CurrentuserService} from "../../../services/gestionUser/service_me/currentuser.service";
@Component({
  selector: 'app-partner-details-with-servicesfront',
  templateUrl: './partner-details-with-servicesfront.component.html',
  styleUrl: './partner-details-with-servicesfront.component.scss'
})
export class PartnerDetailsWithServicesfrontComponent implements OnInit, OnDestroy {
  // Partner details
  partner: Partner | null = null;
  partnerId: number | null = null;
  isLoading: boolean = true;
  error: string = '';
  private subscriptions: Subscription[] = [];

  // Image URL
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;

  // Services related properties
  services: Services[] = [];
  isLoadingServices = false;
  errorServices = '';

  // For filtering and searching
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  // For sorting
  sortBy = 'none';
  sortOrder: 'asc' | 'desc' = 'asc';

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
    { value: 'date', label: 'Date (Newest First)' }
  ];
// Inside the class, add these new properties
  currentUserId: number | null = null;
  selectedServices: number[] = [];
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private partnerService: PartnerControllerService,
      private serviceController: ServiceControllerService,
      private currentuserService: CurrentuserService  // Add this line
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      const idParam = params.get('id');

      if (idParam && !isNaN(+idParam)) {
        this.partnerId = +idParam;
        this.loadPartnerDetails();
        // Add this line
        this.loadCurrentUser();
      } else {
        this.handleError('Invalid partner ID', 'The ID provided in the URL is not valid.');
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadPartnerDetails(): void {
    if (!this.partnerId) {
      this.handleError('Missing ID', 'No partner ID found in the URL.');
      return;
    }

    this.isLoading = true;

    const subscription = this.partnerService.getPartnerById({ id: this.partnerId })
        .pipe(
            take(1),
            catchError(error => {
              let errorMsg = 'Unknown error while retrieving partner';

              if (error instanceof HttpErrorResponse) {
                if (error.status === 404) {
                  errorMsg = `Partner with ID ${this.partnerId} does not exist.`;
                } else if (error.status === 403) {
                  errorMsg = 'You do not have the necessary permissions to access this partner.';
                } else {
                  errorMsg = `Error ${error.status}: ${error.message}`;
                }
              }

              return throwError(() => new Error(errorMsg));
            }),
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe({
          next: (partnerData) => {
            // Only display partners with ACTIVE status
            if (partnerData && partnerData.partnershipStatus === 'ACTIVE' && partnerData.enabled) {
              this.partner = partnerData;

              // Construire l'URL de l'image de profil si disponible
              if (partnerData.profilePicture) {
                this.imageUrl = `${this.apiBaseUrl}/uploads/${partnerData.profilePicture}`;
              }

              // Load partner services after partner details are loaded
              this.loadPartnerServices();
            } else {
              this.handleError('Partner unavailable', 'This partner is not currently active.');
            }
          },
          error: (error) => {
            this.handleError('Loading failed', error.message);
          }
        });

    this.subscriptions.push(subscription);
  }

  loadPartnerServices(): void {
    if (!this.partnerId) return;

    this.isLoadingServices = true;

    const subscription = this.serviceController.getAllServicesOfPartner({ partnerId: this.partnerId })
        .pipe(
            take(1),
            catchError(error => {
              let errorMsg = 'Unable to load services';

              if (error instanceof HttpErrorResponse) {
                errorMsg = `Error ${error.status}: ${error.message}`;
              }

              return throwError(() => new Error(errorMsg));
            }),
            finalize(() => {
              this.isLoadingServices = false;
            })
        )
        .subscribe({
          next: (services) => {
            this.services = services;
          },
          error: (error) => {
            this.errorServices = error.message;
          }
        });

    this.subscriptions.push(subscription);
  }

  // Filter for search, category, and status
  get filteredServices(): Services[] {
    let result = this.services.filter(service => {
      // Filter by search term
      const matchesSearch = !this.searchTerm ||
          service.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

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
  }

  // Change sorting criteria
  changeSortBy(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.toggleSortOrder();
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.sortBy = 'none';
    this.sortOrder = 'asc';
  }

  // Méthode pour obtenir les initiales du partenaire comme alternative à l'image
  getPartnerInitials(): string {
    let initials = '';
    if (this.partner?.firstname) {
      initials += this.partner.firstname.charAt(0).toUpperCase();
    }
    if (this.partner?.lastname) {
      initials += this.partner.lastname.charAt(0).toUpperCase();
    }
    return initials || '?';
  }

  // Méthode pour formater les liens externes
  formatWebsiteUrl(url: string | undefined): string {
    if (!url) return '';

    // Ajouter 'http://' au début si nécessaire
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }

  // Méthode pour obtenir l'icône correspondant à la catégorie
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
    if (!imagePath) {
      return null;
    }
    return `${this.apiBaseUrl}/uploads/${imagePath}`;
  }

  // Méthode pour gérer les erreurs d'image
  handleImageError(event: any): void {
    if (event && event.target) {
      event.target.style.display = 'none';
      if (event.target.nextElementSibling) {
        event.target.nextElementSibling.style.display = 'flex';
      }
    }
  }

  handleError(title: string, message: string): void {
    console.error(`${title}: ${message}`);
    this.error = message;
    this.isLoading = false;
  }

  // navigateBack(): void {
  //   // Navigate back to active partners list
  //   this.router.navigate(['/front-office/activepartners']);
  // }

  viewServiceDetails(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      this.errorServices = 'Service ID not defined';
      return;
    }
    this.router.navigate(['/front-office/service-details', serviceId]);
  }
// Add these methods
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

  selectService(serviceId: number | undefined): void {
    if (!serviceId || !this.currentUserId) {
      console.error('Service ID or User ID not defined');
      this.error = 'You must be logged in to select services';
      return;
    }

    this.isLoadingServices = true;
    const subscription = this.serviceController.selectService({ serviceId, userId: this.currentUserId })
        .pipe(
            take(1),
            finalize(() => {
              this.isLoadingServices = false;
            })
        )
        .subscribe({
          next: () => {
            console.log('Service successfully selected');
            this.selectedServices.push(serviceId);
          },
          error: (error) => {
            console.error('Error selecting service', error);
            this.errorServices = 'Unable to select service. Please try again.';
          }
        });

    this.subscriptions.push(subscription);
  }

  deselectService(serviceId: number | undefined): void {
    if (!serviceId || !this.currentUserId) {
      console.error('Service ID or User ID not defined');
      this.error = 'You must be logged in to deselect services';
      return;
    }

    this.isLoadingServices = true;
    const subscription = this.serviceController.deselectService({ serviceId, userId: this.currentUserId })
        .pipe(
            take(1),
            finalize(() => {
              this.isLoadingServices = false;
            })
        )
        .subscribe({
          next: () => {
            console.log('Service successfully deselected');
            this.selectedServices = this.selectedServices.filter(id => id !== serviceId);
          },
          error: (error) => {
            console.error('Error deselecting service', error);
            this.errorServices = 'Unable to deselect service. Please try again.';
          }
        });

    this.subscriptions.push(subscription);
  }

  isServiceSelected(serviceId: number | undefined): boolean {
    return serviceId !== undefined && this.selectedServices.includes(serviceId);
  }
}