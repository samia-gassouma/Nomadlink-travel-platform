import { Component, OnInit } from '@angular/core';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { User } from "../../../services/gestionUser/models/user";
import { Partner } from "../../../services/gestionUser/models/partner";
import { Router } from '@angular/router';
import { PartnerControllerService } from "../../../services/gestionUser/services/partner-controller.service";
import { API_BASE_URL } from "../constants/api";
import {Services} from "../../../services/gestionUser/models/services";
import {ServiceControllerService} from "../../../services/gestionUser/services/service-controller.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-myprofilepartner',
  templateUrl: './myprofilepartner.component.html',
  styleUrl: './myprofilepartner.component.scss'
})
export class MyprofilepartnerComponent implements OnInit {
  currentUser: User | null = null;
  partnerDetails: Partner | null = null;
  currentUserId: number | null = null;
  activeTab: number = 1;
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;


  // For services tab
  services: Services[] = [];
  isLoading = false;
  errorMessage = '';

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
    { value: 'date', label: 'Date (Newest First)' }
  ];

  // For clients tab
  clients: User[] = [];
  searchTermClient = '';
  sortByClient = 'none';
  sortOrderClient: 'asc' | 'desc' = 'asc';
  itemsPerPageClient = 10;
  currentPageClient = 1;
  displayedClients: User[] = [];

// Sorting options for clients
  clientSortOptions = [
    { value: 'none', label: 'No Sorting' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'email', label: 'Email (A-Z)' }
  ];

  constructor(
      private currentuserService: CurrentuserService,
      private partnerService: PartnerControllerService,
      private serviceController: ServiceControllerService,
      private router: Router
  ) {}

  ngOnInit(): void {
    // Load user information when component initializes
    this.currentuserService.loadCurrentUser();

    // Subscribe to subjects to get information
    this.currentuserService.getCurrentUser().subscribe((user: User | null) => {
      this.currentUser = user;

      // Construct profile picture URL if available
      if (user && user.profilePicture) {
        this.imageUrl = `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
      }

      // If user is a partner and we have an ID, fetch partner details
      if (user && user.role === 'PARTNER' && user.id) {
        this.loadPartnerDetails(user.id);
      }
    });

    this.currentuserService.getCurrentUserId().subscribe((id: number | null) => {
      this.currentUserId = id;
      if (id) {
        this.loadPartnerServices(id);
        this.loadPartnerClients(id); // Add this line

      }
    });
  }

  // Load partner-specific details
  loadPartnerDetails(partnerId: number): void {
    this.partnerService.getPartnerById({ id: partnerId }).subscribe(
        (partner: Partner) => {
          this.partnerDetails = partner;
        },
        error => {
          console.error('Error loading partner details:', error);
        }
    );
  }

  // Méthode pour vérifier si l'utilisateur est un Partner
  isPartner(): boolean {
    return this.currentUser?.role === 'PARTNER';
  }

  // Change active tab
  changeTab(tabId: number): void {
    this.activeTab = tabId;
  }

  // Logout functionality
  logout(): void {
    // Add your logout logic here
    console.log('Logout clicked');
  }

  // Navigation for editing profile
  navigateToEditProfile(): void {
    // Add your navigation logic here
    console.log('Edit profile clicked');
  }

  //Handle image error
  // handleImageError(): void {
  //   this.imageUrl = null;
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


  // Load partner services for the Services tab
  loadPartnerServices(partnerId: number): void {
    this.isLoading = true;
    this.serviceController.getAllServicesOfPartner({ partnerId })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(
            services => {
              this.services = services;
              console.log('Services loaded:', services);
              this.updateDisplayedServices();
            },
            error => {
              console.error('Error loading services', error);
              this.errorMessage = 'Unable to load services. Please try again.';
            }
        );
  }

  // Service management methods
  editService(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      this.errorMessage = 'Service ID not defined';
      return;
    }
    this.router.navigate(['/front-office/updatemyservicepartner', serviceId]);
  }

  deleteService(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      this.errorMessage = 'Service ID not defined';
      return;
    }

    if (confirm('Are you sure you want to delete this service?')) {
      this.isLoading = true;
      this.serviceController.deleteService({ id: serviceId })
          .pipe(
              finalize(() => {
                this.isLoading = false;
              })
          )
          .subscribe(
              () => {
                this.services = this.services.filter(service => service.id !== serviceId);
                console.log('Service successfully deleted');
                this.updateDisplayedServices();
              },
              error => {
                console.error('Error deleting service', error);
                this.errorMessage = 'Unable to delete service. Please try again.';
              }
          );
    }
  }

  createNewService(): void {
    this.router.navigate(['/front-office/createservicepartner']);
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

  viewServiceDetails(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      this.errorMessage = 'Service ID not defined';
      return;
    }
    this.router.navigate(['/front-office/service-detailspartner', serviceId]);
  }

  protected readonly Math = Math;


  // Add this to ngOnInit or create a separate method called from ngOnInit
  loadPartnerClients(partnerId: number): void {
    this.isLoading = true;
    this.serviceController.getClientsOfPartner({ partnerId })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(
            clients => {
              this.clients = clients;
              console.log('Clients loaded:', clients);
              this.updateDisplayedClients();
            },
            error => {
              console.error('Error loading clients', error);
              this.errorMessage = 'Unable to load clients. Please try again.';
            }
        );
  }

// Filter for search
  get filteredClients(): User[] {
    let result = this.clients.filter(client => {
      // Filter by search term
      const matchesSearch = !this.searchTermClient ||
          client.firstname?.toLowerCase().includes(this.searchTermClient.toLowerCase()) ||
          client.lastname?.toLowerCase().includes(this.searchTermClient.toLowerCase()) ||
          client.email?.toLowerCase().includes(this.searchTermClient.toLowerCase()) ||
          client.phoneNumber?.toLowerCase().includes(this.searchTermClient.toLowerCase());

      return matchesSearch;
    });

    // Apply sorting
    result = this.sortClients(result);

    return result;
  }

// Sort clients based on selected criteria
  sortClients(clients: User[]): User[] {
    if (this.sortByClient === 'none') return clients;

    return [...clients].sort((a, b) => {
      let comparison = 0;

      switch (this.sortByClient) {
        case 'name':
          comparison = this.compareValues(a.firstname, b.firstname) ||
              this.compareValues(a.lastname, b.lastname);
          break;
        case 'email':
          comparison = this.compareValues(a.email, b.email);
          break;
      }

      // Apply sort order (asc/desc)
      return this.sortOrderClient === 'asc' ? comparison : -comparison;
    });
  }

// Toggle sort order when clicking on the same sorting option
  toggleSortOrderClient(): void {
    this.sortOrderClient = this.sortOrderClient === 'asc' ? 'desc' : 'asc';
    this.updateDisplayedClients();
  }

// Change sorting criteria
  changeSortByClient(sortBy: string): void {
    if (this.sortByClient === sortBy) {
      this.toggleSortOrderClient();
    } else {
      this.sortByClient = sortBy;
      this.sortOrderClient = 'asc';
    }
    this.updateDisplayedClients();
  }

  resetFiltersClient(): void {
    this.searchTermClient = '';
    this.sortByClient = 'none';
    this.sortOrderClient = 'asc';
    this.currentPageClient = 1;
    this.updateDisplayedClients();
  }

// Pagination
  pageChangedClient(page: number): void {
    this.currentPageClient = page;
    this.updateDisplayedClients();
  }

  updateDisplayedClients(): void {
    const startIndex = (this.currentPageClient - 1) * this.itemsPerPageClient;
    this.displayedClients = this.filteredClients.slice(startIndex, startIndex + this.itemsPerPageClient);
  }

  getUserImageUrl(user: User): string | null {
    if (user && user.profilePicture) {
      return `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
    }
    return null;
  }

  getUserInitials(user: User): string {
    let initials = '';
    if (user.firstname) {
      initials += user.firstname.charAt(0).toUpperCase();
    }
    if (user.lastname) {
      initials += user.lastname.charAt(0).toUpperCase();
    }
    return initials || '?';
  }

  viewClientServices(clientId: number | undefined): void {
    if (clientId === undefined) {
      console.error('Client ID not defined');
      this.errorMessage = 'Client ID not defined';
      return;
    }
    this.router.navigate(['/front-office/client-service-selected', clientId]);
  }


}