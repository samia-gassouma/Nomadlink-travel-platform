import { Component, OnDestroy, OnInit } from '@angular/core';
import { Partner } from "../../../services/gestionUser/models/partner";
import { Subscription, throwError } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { PartnerControllerService } from "../../../services/gestionUser/services/partner-controller.service";
import { catchError, finalize, take } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { API_BASE_URL } from "../constants/api"; // Importez la constante API_BASE_URL

@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.scss']
})
export class PartnerDetailsComponent implements OnInit, OnDestroy {
  partner: Partner | null = null;
  partnerId: number | null = null;
  isLoading: boolean = true;
  error: string = '';
  private subscriptions: Subscription[] = [];

  // Nouvelle propriété pour l'URL de l'image
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private partnerService: PartnerControllerService
  ) {}

  ngOnInit(): void {
    console.log('PartnerDetailsComponent initialized');
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      const idParam = params.get('id');
      console.log('Route param id:', idParam);

      if (idParam && !isNaN(+idParam)) {
        this.partnerId = +idParam;
        this.loadPartnerDetails();
      } else {
        this.handleError('Invalid partner ID', 'The ID provided in the URL is not valid.');
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('PartnerDetailsComponent destroyed');
  }

  loadPartnerDetails(): void {
    if (!this.partnerId) {
      this.handleError('Missing ID', 'No partner ID found in the URL.');
      return;
    }

    this.isLoading = true;
    console.log('Loading partner details for ID:', this.partnerId);

    const subscription = this.partnerService.getPartnerById({ id: this.partnerId })
        .pipe(
            take(1),
            catchError(error => {
              let errorMsg = 'Unknown error while retrieving partner';

              if (error instanceof HttpErrorResponse) {
                console.error('HTTP error details:', error.message);
                console.error('Status:', error.status);
                console.error('Body:', error.error);

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
              console.log('Partner loading completed');
            })
        )
        .subscribe({
          next: (partnerData) => {
            console.log('Partner data loaded successfully:', partnerData);
            this.partner = partnerData;

            // Construire l'URL de l'image de profil si disponible
            if (partnerData && partnerData.profilePicture) {
              this.imageUrl = `${this.apiBaseUrl}/uploads/${partnerData.profilePicture}`;
            }
          },
          error: (error) => {
            this.handleError('Loading failed', error.message);
          }
        });

    this.subscriptions.push(subscription);
  }

  // Méthode pour gérer les erreurs d'image
  handleImageError(): void {
    this.imageUrl = null;
  }

  handleError(title: string, message: string): void {
    console.error(`${title}: ${message}`);
    this.error = message;
    this.isLoading = false;
  }

  navigateToPartnerList(): void {
    this.router.navigate(['/back-office/partners']);
  }

  navigateToEditPartner(): void {
    if (this.partnerId) {
      this.router.navigate(['/back-office/partner/update', this.partnerId]);
    }
  }

  navigateToPartnerServices(): void {
    if (this.partnerId) {
      this.router.navigate(['/back-office/partner-services', this.partnerId]);
    }
  }
  // Ajout de la méthode dans partner-details.component.ts
  navigateToPartnerClients(): void {
    if (this.partnerId) {
      this.router.navigate(['/back-office/partner-clients', this.partnerId]);
    }
  }
}