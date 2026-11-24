import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ServiceControllerService } from '../../../services/gestionUser/services/service-controller.service';
import { Services } from '../../../services/gestionUser/models/services';
import { User } from '../../../services/gestionUser/models/user';
import { API_BASE_URL } from '../constants/api';


@Component({
  selector: 'app-service-details-admin',
  templateUrl: './service-details-admin.component.html',
  styleUrl: './service-details-admin.component.scss'
})
export class ServiceDetailsAdminComponent implements OnInit {
  service: Services | null = null;
  serviceId: number | null = null;
  isLoading = true;
  errorMessage = '';
  apiBaseUrl = API_BASE_URL;

  // For clients pagination
  clients: User[] = [];
  filteredClients: User[] = [];
  displayedClients: User[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Client search and filter
  searchTerm = '';

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private serviceController: ServiceControllerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam && !isNaN(+idParam)) {
        this.serviceId = +idParam;
        this.loadServiceDetails();
      } else {
        this.isLoading = false;
        this.errorMessage = 'Invalid service ID';
      }
    });
  }

  loadServiceDetails(): void {
    if (!this.serviceId) {
      this.errorMessage = 'Service ID is missing';
      this.isLoading = false;
      return;
    }

    forkJoin({
      serviceDetails: this.serviceController.getServiceById({ id: this.serviceId }),
      serviceClients: this.serviceController.getUsersByService({ serviceId: this.serviceId })
    })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe({
          next: (result) => {
            this.service = result.serviceDetails;
            this.clients = result.serviceClients;
            this.applyClientFilters();
          },
          error: (error) => {
            console.error('Error loading service details', error);
            this.errorMessage = 'Unable to load service details. Please try again.';
          }
        });
  }

  applyClientFilters(): void {
    let result = [...this.clients];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(client =>
          (client.firstname?.toLowerCase().includes(term) || false) ||
          (client.lastname?.toLowerCase().includes(term) || false) ||
          (client.email?.toLowerCase().includes(term) || false)
      );
    }

    this.filteredClients = result;
    this.totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
    this.updateDisplayedClients();
  }

  updateDisplayedClients(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredClients.length);
    this.displayedClients = this.filteredClients.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedClients();
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

  getServiceImageUrl(imagePath: string | undefined): string | null {
    if (!imagePath) {
      return null;
    }
    return `${this.apiBaseUrl}/uploads/${imagePath}`;
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
    const placeholder = event.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
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

  getPartnershipStatusClass(status?: string): string {
    if (!status) return 'status-unknown';

    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'PENDING': return 'status-pending';
      case 'SUSPENDED': return 'status-suspended';
      case 'TERMINATED': return 'status-terminated';
      default: return 'status-unknown';
    }
  }

  editService(): void {
    if (this.serviceId) {
      this.router.navigate(['/back-office/edit-service', this.serviceId]);
    }
  }

  deleteService(): void {
    if (!this.serviceId) {
      return;
    }

    if (confirm('Are you sure you want to delete this service?')) {
      this.isLoading = true;

      this.serviceController.deleteService({ id: this.serviceId })
          .pipe(
              finalize(() => {
                this.isLoading = false;
              })
          )
          .subscribe({
            next: () => {
              console.log('Service successfully deleted');
              this.router.navigate(['/back-office/services']);
            },
            error: (error) => {
              console.error('Error deleting service', error);
              this.errorMessage = 'Unable to delete service. Please try again.';
            }
          });
    }
  }

  goBackToList(): void {
    this.router.navigate(['/back-office/services']);
  }

  viewPartnerDetails(): void {
    if (this.service?.partner?.id) {
      this.router.navigate(['/back-office/partner', this.service.partner.id]);
    }
  }

  viewClientDetails(clientId: number | undefined): void {
    if (clientId) {
      this.router.navigate(['/back-office/user', clientId]);
    }
  }

  protected readonly Math = Math;
}