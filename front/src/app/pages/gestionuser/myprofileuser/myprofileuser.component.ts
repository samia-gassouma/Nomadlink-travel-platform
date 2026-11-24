import { Component, OnInit } from '@angular/core';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { User } from "../../../services/gestionUser/models/user";
import { Router } from '@angular/router';
import { API_BASE_URL } from "../constants/api";
import {Services} from "../../../services/gestionUser/models/services";
import {ServiceControllerService} from "../../../services/gestionUser/services/service-controller.service";
import {PartnerControllerService} from "../../../services/gestionUser/services/partner-controller.service";
import {Partner} from "../../../services/gestionUser/models/partner";
import {finalize} from "rxjs/operators";
import {PreferenceControllerService} from "../../../services/gestionUser/services/preference-controller.service";
import {Preference} from "../../../services/gestionUser/models/preference";

@Component({
  selector: 'app-myprofileuser',
  templateUrl: './myprofileuser.component.html',
  styleUrl: './myprofileuser.component.scss'
})
export class MyprofileuserComponent implements OnInit {
  currentUser: User | null = null;
  currentUserId: number | null = null;
  activeTab: number = 1;
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;


  // For selected services
  selectedServices: Services[] = [];
  isLoading = false;
  errorMessage = '';
  // Add these properties to your MyprofileuserComponent class
  itemsPerPage = 8;
  currentPage = 1;
  displayedSelectedServices: Services[] = [];

  constructor(
      private currentuserService: CurrentuserService,
      private serviceController: ServiceControllerService,
      private partnerService: PartnerControllerService,
      private preferenceController: PreferenceControllerService, // Ajoutez cette ligne
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
    });

    this.currentuserService.getCurrentUserId().subscribe((id: number | null) => {
      this.currentUserId = id;
      if (id) {
        this.loadSelectedServices(id);
        this.loadUserPreferences(id); // Ajoutez cette ligne

      }
    });
  }

  // Change active tab
  // changeTab(tabId: number): void {
  //   this.activeTab = tabId;
  // }

  // Logout functionality
  logout(): void {
    // Add your logout logic here
    console.log('Logout clicked');
  }

  // Handle image error
  // handleImageError(): void {
  //   this.imageUrl = null;
  // }


  // Load selected services
  loadSelectedServices(userId: number): void {
    this.isLoading = true;
    this.serviceController.getSelectedServicesOfUser({ userId })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(
            services => {
              this.selectedServices = services;
              this.updateDisplayedServices(); // Add this line to update displayed services
              console.log('Selected services loaded:', this.selectedServices);
            },
            error => {
              console.error('Error loading selected services', error);
              this.errorMessage = 'Unable to load your selected services. Please try again.';
            }
        );
  }
  // Add these new methods
  pageChanged(page: number): void {
    this.currentPage = page;
    this.updateDisplayedServices();
  }

  updateDisplayedServices(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedSelectedServices = this.selectedServices.slice(startIndex, startIndex + this.itemsPerPage);
  }
  // Change active tab
  changeTab(tabId: number): void {
    this.activeTab = tabId;
  }

  // Deselect service
// Deselect service
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
              // Remove the service from the list
              this.selectedServices = this.selectedServices.filter(service => service.id !== serviceId);

              // Update the displayed services after removing the service
              this.updateDisplayedServices();

              // Check if current page is now empty and adjust if needed
              const totalPages = Math.ceil(this.selectedServices.length / this.itemsPerPage);
              if (this.currentPage > totalPages && totalPages > 0) {
                this.currentPage = totalPages;
                this.updateDisplayedServices();
              }
            },
            error => {
              console.error('Error deselecting service', error);
              this.errorMessage = 'Unable to deselect service. Please try again.';
            }
        );
  }
  // View service details
  viewServiceDetails(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      this.errorMessage = 'Service ID not defined';
      return;
    }
    this.router.navigate(['/front-office/service-details', serviceId]);
  }

  // View partner details
  viewPartnerDetails(partnerId: number | undefined): void {
    if (partnerId === undefined) {
      console.error('Partner ID not defined');
      this.errorMessage = 'Partner ID not defined';
      return;
    }
    this.router.navigate(['/front-office/partnerdetail', partnerId]);
  }

  // Get icon for category
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

  // Get service image URL
  getServiceImageUrl(imagePath: string | undefined): string | null {
    if (!imagePath) {
      return null;
    }
    return `${this.apiBaseUrl}/uploads/${imagePath}`;
  }

  // Handle image error
  // handleImageError(event?: any): void {
  //   if (event) {
  //     event.target.style.display = 'none';
  //     event.target.nextElementSibling.style.display = 'flex';
  //   } else {
  //     this.imageUrl = null;
  //   }
  // }
// Handle image error
  handleImageError(event?: any): void {
    if (event && event.target) {
      // Handle service image error
      event.target.style.display = 'none';

      // Check if nextElementSibling exists before accessing it
      if (event.target.nextElementSibling) {
        event.target.nextElementSibling.style.display = 'flex';
      }
    } else {
      // Handle profile image error
      this.imageUrl = null;
    }
  }
  // Get partner name
  getPartnerName(partner?: Partner): string {
    if (!partner) return 'Unknown Partner';
    return `${partner.firstname || ''} ${partner.lastname || ''}`.trim() || 'Unknown Partner';
  }

  // Get partner initials
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

  // Get partner image URL
  getPartnerImageUrl(partner: Partner | undefined): string | null {
    if (partner && partner.profilePicture) {
      return `${this.apiBaseUrl}/uploads/${partner.profilePicture}`;
    }
    return null;
  }

  // Handle partner image error
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


  // Pour les préférences de l'utilisateur
  userPreferences: Preference[] = [];
  preferencesLoading = false;
  preferencesError = '';
  loadUserPreferences(userId: number): void {
    this.preferencesLoading = true;
    this.preferenceController.getUserPreferences({ userId })
        .pipe(
            finalize(() => {
              this.preferencesLoading = false;
            })
        )
        .subscribe(
            preferences => {
              this.userPreferences = preferences;
              console.log('User preferences loaded:', this.userPreferences);
            },
            error => {
              console.error('Error loading user preferences', error);
              this.preferencesError = 'Unable to load your preferences. Please try again.';
            }
        );
  }
  // Add this method to MyprofileuserComponent class
  removeUserPreference(preferenceId: number | undefined): void {
    if (!preferenceId || !this.currentUserId) {
      console.error('Preference ID or User ID not defined');
      this.preferencesError = 'Unable to remove preference. Please try again.';
      return;
    }

    this.preferencesLoading = true;
    this.preferenceController.removePreferenceFromUser({
      userId: this.currentUserId,
      preferenceId: preferenceId
    })
        .pipe(
            finalize(() => {
              this.preferencesLoading = false;
            })
        )
        .subscribe(
            () => {
              console.log('Preference successfully removed');
              // Remove the preference from the list
              this.userPreferences = this.userPreferences.filter(pref => pref.id !== preferenceId);
            },
            error => {
              console.error('Error removing preference', error);
              this.preferencesError = 'Unable to remove preference. Please try again.';
            }
        );
  }

}