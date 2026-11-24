import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { Services } from "../../../services/gestionUser/models/services";
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-service-detailsp',
  templateUrl: './service-detailsp.component.html',
  styleUrl: './service-detailsp.component.scss'
})
export class ServiceDetailspComponent implements OnInit {
  service: Services | null = null;
  serviceId: number | null = null;
  isLoading = true;
  errorMessage = '';
  apiBaseUrl = API_BASE_URL;

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

    this.serviceController.getServiceById({ id: this.serviceId })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(
            service => {
              this.service = service;
              console.log('Service details loaded:', service);
            },
            error => {
              console.error('Error loading service details', error);
              this.errorMessage = 'Unable to load service details. Please try again.';
            }
        );
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

  editService(): void {
    if (this.serviceId) {
      this.router.navigate(['/front-office/updatemyservicepartner', this.serviceId]);
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
          .subscribe(
              () => {
                console.log('Service successfully deleted');
                this.router.navigate(['/front-office/updatemyservicepartner']);
              },
              error => {
                console.error('Error deleting service', error);
                this.errorMessage = 'Unable to delete service. Please try again.';
              }
          );
    }
  }

  goBackToList(): void {
    this.router.navigate(['/front-office/myprofilepartner']);
  }
}