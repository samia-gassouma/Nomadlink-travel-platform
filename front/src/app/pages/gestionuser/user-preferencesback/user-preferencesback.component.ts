import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { PreferenceControllerService } from '../../../services/gestionUser/services/preference-controller.service';
import { UserControllerService } from '../../../services/gestionUser/services/user-controller.service';
import { Preference } from '../../../services/gestionUser/models/preference';
import { User } from '../../../services/gestionUser/models/user';

@Component({
  selector: 'app-user-preferencesback',
  templateUrl: './user-preferencesback.component.html',
  styleUrl: './user-preferencesback.component.scss'
})
export class UserPreferencesbackComponent  implements OnInit, OnDestroy {
  userId: number | null = null;
  user: User | null = null;
  userPreferences: Preference[] = [];
  isLoading = false;
  error = '';
  private subscriptions: Subscription[] = [];

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private preferenceController: PreferenceControllerService,
      private userService: UserControllerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      const idParam = params.get('id');
      if (idParam && !isNaN(+idParam)) {
        this.userId = +idParam;
        this.loadUserDetails();
        this.loadUserPreferences();
      } else {
        this.error = 'Invalid user ID';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUserDetails(): void {
    if (!this.userId) return;

    this.isLoading = true;
    const subscription = this.userService.getUserDetailsById({ id: this.userId })
        .pipe(
            take(1),
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe({
          next: (userData) => {
            this.user = userData;
          },
          error: (error) => {
            this.error = `Failed to load user details: ${error.message}`;
          }
        });

    this.subscriptions.push(subscription);
  }

  loadUserPreferences(): void {
    if (!this.userId) return;

    this.isLoading = true;
    const subscription = this.preferenceController.getUserPreferences({ userId: this.userId })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe({
          next: (preferences) => {
            this.userPreferences = preferences;
          },
          error: (error) => {
            this.error = `Failed to load preferences: ${error.message}`;
          }
        });

    this.subscriptions.push(subscription);
  }

  navigateBack(): void {
    if (this.userId) {
      this.router.navigate(['/back-office/user/details', this.userId]);
    } else {
      this.router.navigate(['/back-office/users']);
    }
  }

  removeUserPreference(preferenceId: number | undefined): void {
    if (!preferenceId || !this.userId) {
      this.error = 'Cannot remove preference: Missing preference ID or user ID';
      return;
    }

    this.isLoading = true;
    this.preferenceController.removePreferenceFromUser({
      userId: this.userId,
      preferenceId: preferenceId
    })
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe({
          next: () => {
            // Remove the preference from the list
            this.userPreferences = this.userPreferences.filter(pref => pref.id !== preferenceId);
          },
          error: (error) => {
            this.error = `Failed to remove preference: ${error.message}`;
          }
        });
  }
}