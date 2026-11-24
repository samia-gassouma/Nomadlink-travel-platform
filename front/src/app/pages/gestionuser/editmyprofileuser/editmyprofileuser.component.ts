import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from "@angular/router";
import { UpdateUser$Params } from "../../../services/gestionUser/fn/user-controller/update-user";
import { Subscription, throwError } from 'rxjs';
import { finalize, take, catchError } from 'rxjs/operators';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { UserControllerService } from "../../../services/gestionUser/services/user-controller.service";
import { User } from "../../../services/gestionUser/models/user";
import { HttpErrorResponse } from '@angular/common/http';
import {API_BASE_URL} from "../constants/api";
import { HttpClient } from '@angular/common/http';
import { AuthenticationControllerService } from "../../../services/gestionUser/services/authentication-controller.service";
import { ChangePassword$Params } from "../../../services/gestionUser/fn/authentication-controller/change-password";
@Component({
  selector: 'app-editmyprofileuser',
  templateUrl: './editmyprofileuser.component.html',
  styleUrl: './editmyprofileuser.component.scss'
})
export class EditmyprofileuserComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  currentUser: User | null = null;
  currentUserId: number | null = null;
  isLoading: boolean = true;
  submitError: string | null = null;
  loadAttempted: boolean = false;
  private subscriptions: Subscription[] = [];
  formInitialized: boolean = false;
  submitted = false;
  activeTab: number = 1;

  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;
  selectedFile: File | null = null;

  // For password change
  passwordForm!: FormGroup;
  passwordChangeSubmitted = false;
  passwordChangeError: string | null = null;
  passwordChangeSuccess: string | null = null;
  passwordVisible = false; // Added to match create-user component

  genders = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'RU', name: 'Russia' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AR', name: 'Argentina' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SG', name: 'Singapore' }
  ];

  constructor(
      private router: Router,
      private userService: UserControllerService,
      private currentuserService: CurrentuserService,
      private authService: AuthenticationControllerService, // Add this
      private fb: FormBuilder,
      private http: HttpClient // Add this

  ) {
    this.initializeForm();
    this.initializePasswordForm();
  }

  ngOnInit(): void {
    console.log('EditMyProfileComponent initialized');

    // Load current user data
    this.currentuserService.loadCurrentUser();

    // Subscribe to get current user information
    const userSubscription = this.currentuserService.getCurrentUser().subscribe((user: User | null) => {
      this.currentUser = user;
      if (user && user.id) {
        this.currentUserId = user.id; // Fix type issue - ensure id exists
        this.populateForm(user);
        this.isLoading = false;
        this.submitError = null; // Clear any existing error when user data loads
      }
    });

    const userIdSubscription = this.currentuserService.getCurrentUserId().subscribe((id: number | null) => {
      if (id !== null) {
        this.currentUserId = id;
      }
    });

    this.subscriptions.push(userSubscription, userIdSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('EditMyProfileComponent destroyed');
  }

  initializeForm(): void {
    if (this.formInitialized) {
      return;
    }

    this.userForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ]],
      address: [''],
      country: ['', Validators.required],
      gender: [''],
      dateOfBirth: ['']
    });

    this.formInitialized = true;
    console.log('Form initialized with validations');
  }

  // Password validation methods - copied from create user component
  hasUpperCase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /[A-Z]/.test(value) ? null : { upperCase: true };
  }

  hasLowerCase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /[a-z]/.test(value) ? null : { lowerCase: true };
  }

  hasNumeric(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /[0-9]/.test(value) ? null : { numeric: true };
  }

  hasSpecialChar(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ? null : { specialChar: true };
  }

  // Renamed from hasPasswordError to checkPasswordError to avoid duplication
  checkPasswordError(errorType: string): boolean {
    const control = this.passwordForm.get('newPassword');
    return !!(control && control.touched && control.hasError(errorType));
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  initializePasswordForm(): void {
    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.hasUpperCase,
        this.hasLowerCase,
        this.hasNumeric,
        this.hasSpecialChar
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  populateForm(user: User): void {
    if (!user) {
      return;
    }
    if (user && user.profilePicture) {
      this.imageUrl = `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
    }
    console.log('Populating form with user data:', JSON.stringify(user));

    // Map backend fields to form fields
    this.userForm.patchValue({
      firstName: user.firstname || '',
      lastName: user.lastname || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      country: user.country || '',
      gender: user.genre || '',
      dateOfBirth: user.dateOfBirth ? this.formatDate(user.dateOfBirth) : ''
    });

    console.log('Form values after population:', this.userForm.value);
    this.userForm.markAsPristine();
  }

  formatDate(date: string | Date): string {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    return d.toISOString().split('T')[0];
  }

  handleMissingId(): void {
    console.error('No user ID available');
    this.isLoading = false;
    this.submitError = 'User information not available. Please log in again.';
    setTimeout(() => this.router.navigate(['/dashboard']), 3000);
  }

  onUpdate(): void {
    this.submitted = true;

    if (!this.currentUser || this.currentUserId === null) {
      console.error('Cannot update: User data is not available');
      this.submitError = 'Cannot update: User data is not available';
      return;
    }

    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid, cannot submit');
      return;
    }

    const formValues = this.userForm.value;
    console.log('Form values to submit:', formValues);

    // Map form fields back to backend expected structure
    const updateData = {
      firstname: formValues.firstName,
      lastname: formValues.lastName,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      address: formValues.address,
      country: formValues.country,
      genre: formValues.gender,
      dateOfBirth: formValues.dateOfBirth
    };

    const updateParams: UpdateUser$Params = {
      id: this.currentUserId,
      body: updateData
    };

    this.isLoading = true;
    console.log('Updating user with params:', updateParams);

    const subscription = this.userService.updateUser(updateParams)
        .pipe(
            take(1),
            catchError((error: HttpErrorResponse) => {
              console.error(`Error updating user with ID ${this.currentUserId}:`, error);
              return throwError(() => new Error(`Failed to update user: ${error.message || 'Server error'}`));
            }),
            finalize(() => {
              // Ne finalisez pas ici car vous devrez peut-être uploader l'image ensuite
              if (!this.selectedFile) {
                this.isLoading = false;
                console.log('Update process completed without image upload');
              }
            })
        )
        .subscribe({
          next: (updatedUser) => {
            console.log('User updated successfully', updatedUser);

            // Maintenant que l'utilisateur est mis à jour, téléchargez l'image si nécessaire
            if (this.selectedFile) {
              this.uploadProfilePictureAfterUpdate();
            } else {
              // Si pas d'image à télécharger, terminez simplement le processus
              this.isLoading = false;
              this.currentuserService.loadCurrentUser();
              this.router.navigate(['/front-office/myprofileuser']);
            }
          },
          error: (error: Error) => {
            console.error('Error in update user subscription:', error);
            this.submitError = `Failed to update user: ${error.message || 'Please try again.'}`;
            this.isLoading = false;
          }
        });

    this.subscriptions.push(subscription);
  }

  onChangePassword(): void {
    this.passwordChangeSubmitted = true;
    this.passwordChangeError = null;
    this.passwordChangeSuccess = null;

    if (this.passwordForm.invalid) {
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.currentUserId === null) {
      this.passwordChangeError = 'User ID not available. Please log in again.';
      return;
    }

    const { newPassword } = this.passwordForm.value;
    this.isLoading = true;

    // Replace the call with this
    const subscription = this.authService.changePassword({
      body: {
        userId: this.currentUserId,
        newPassword: newPassword
      }
    }).pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          console.error(`Error changing password:`, error);
          return throwError(() => new Error(`Failed to change password: ${error.message || 'Server error'}`));
        }),
        finalize(() => {
          this.isLoading = false;
        })
    ).subscribe({
      next: () => {
        this.passwordChangeSuccess = 'Password changed successfully!';
        this.passwordForm.reset();
        this.passwordChangeSubmitted = false;

        // Redirect to profile page after successful password change
        setTimeout(() => {
          this.router.navigate(['/front-office/myprofileuser']);
        }, 2000);
      },
      error: (error: Error) => {
        this.passwordChangeError = `Failed to change password: ${error.message || 'Please try again.'}`;
      }
    });

    this.subscriptions.push(subscription);
  }
  changeTab(tabId: number): void {
    this.activeTab = tabId;
    // Reset error messages when changing tabs
    if (tabId === 1) {
      this.submitError = null;
    } else if (tabId === 2) {
      this.passwordChangeError = null;
      this.passwordChangeSuccess = null;
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }

  hasPasswordError(controlName: string, errorName: string): boolean {
    const control = this.passwordForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }

  hasPasswordMismatchError(): boolean {
    return this.passwordForm.hasError('passwordMismatch') &&
        (this.passwordForm.get('confirmPassword')?.touched ?? false);
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Don't upload immediately - wait for form submission
    }
  }

  handleImageError(): void {
    this.imageUrl = null;
  }
// Fix for the uploadProfilePicture method
  // Nouvelle méthode pour télécharger l'image après la mise à jour de l'utilisateur
  uploadProfilePictureAfterUpdate(): void {
    if (this.selectedFile && this.currentUserId) {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Call your service to upload profile picture using HttpClient directly
      const url = `${this.apiBaseUrl}/users/update/${this.currentUserId}/profile-picture`;

      this.http.put<User>(url, formData)
          .pipe(
              take(1),
              catchError((error) => {
                console.error('Error uploading profile picture:', error);
                return throwError(() => new Error('Failed to upload profile picture'));
              }),
              finalize(() => {
                this.isLoading = false;
                console.log('Image upload process completed');
              })
          )
          .subscribe({
            next: (updatedUser) => {
              console.log('Profile picture updated successfully');
              this.currentuserService.loadCurrentUser();
              // Naviguez seulement après que le téléchargement de l'image soit terminé
              this.router.navigate(['/front-office/myprofileuser']);
              this.selectedFile = null; // Réinitialiser selectedFile après le téléchargement
            },
            error: (error) => {
              console.error('Error in profile picture update:', error);
              this.submitError = 'Failed to update profile picture';
              // Même en cas d'erreur avec l'image, nous pouvons rediriger car les données utilisateur ont été sauvegardées
              this.router.navigate(['/front-office/myprofileuser']);
            }
          });
    }
  }

}