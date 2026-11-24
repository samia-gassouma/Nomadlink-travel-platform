import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserControllerService } from "../../../services/gestionUser/services/user-controller.service";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../../../services/gestionUser/models/user";
import { Subscription, throwError } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { API_BASE_URL } from "../constants/api"; // Importez votre constante API_BASE_URL

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userId: number | null = null;
  isLoading: boolean = true;
  error: string = '';
  private subscriptions: Subscription[] = [];

  // Nouvelle propriété pour l'URL de l'image
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserControllerService
  ) {}

  ngOnInit(): void {
    console.log('UserDetailsComponent initialized');
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      const idParam = params.get('id');
      console.log('Route param id:', idParam);

      if (idParam && !isNaN(+idParam)) {
        this.userId = +idParam;
        this.loadUserDetails();
      } else {
        this.handleError('ID d\'utilisateur invalide', 'L\'ID fourni dans l\'URL n\'est pas valide.');
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('UserDetailsComponent destroyed');
  }

  loadUserDetails(): void {
    if (!this.userId) {
      this.handleError('ID manquant', 'Aucun ID d\'utilisateur trouvé dans l\'URL.');
      return;
    }

    this.isLoading = true;
    console.log('Loading user details for ID:', this.userId);

    const subscription = this.userService.getUserDetailsById({ id: this.userId })
        .pipe(
            take(1),
            catchError(error => {
              let errorMsg = 'Erreur inconnue lors de la récupération de l\'utilisateur';

              if (error instanceof HttpErrorResponse) {
                console.error('Détails de l\'erreur HTTP:', error.message);
                console.error('Status:', error.status);
                console.error('Body:', error.error);

                if (error.status === 404) {
                  errorMsg = `L'utilisateur avec l'ID ${this.userId} n'existe pas.`;
                } else if (error.status === 403) {
                  errorMsg = 'Vous n\'avez pas les permissions nécessaires pour accéder à cet utilisateur.';
                } else {
                  errorMsg = `Erreur ${error.status}: ${error.message}`;
                }
              }

              return throwError(() => new Error(errorMsg));
            }),
            finalize(() => {
              this.isLoading = false;
              console.log('User loading completed');
            })
        )
        .subscribe({
          next: (userData) => {
            console.log('User data loaded successfully:', userData);
            this.user = userData;

            // Construire l'URL de l'image de profil si disponible
            if (userData && userData.profilePicture) {
              this.imageUrl = `${this.apiBaseUrl}/uploads/${userData.profilePicture}`;
            }
          },
          error: (error) => {
            this.handleError('Échec du chargement', error.message);
          }
        });

    this.subscriptions.push(subscription);
  }

  // Ajouter la méthode pour gérer les erreurs d'image
  handleImageError(): void {
    this.imageUrl = null;
  }

  handleError(title: string, message: string): void {
    console.error(`${title}: ${message}`);
    this.error = message;
    this.isLoading = false;
  }

  navigateToUserList(): void {
    this.router.navigate(['/back-office/users']);
  }

  navigateToEditUser(): void {
    if (this.userId) {
      this.router.navigate(['/back-office/user/update', this.userId]);
    }
  }

  navigateToUserServices(): void {
    if (this.user && this.user.id) {
      this.router.navigate(['/back-office/user/selectedservices', this.user.id]);
    }
  }
  // In user-details.component.ts
  navigateToUserPreferences(): void {
    if (this.user && this.user.id) {
      this.router.navigate(['/back-office/user/preferences', this.user.id]);
    }
  }
}