import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from "@angular/router";
import { Subscription, throwError } from 'rxjs';
import { finalize, take, catchError } from 'rxjs/operators';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { PartnerControllerService } from "../../../services/gestionUser/services/partner-controller.service";
import { Partner } from "../../../services/gestionUser/models/partner";
import { User } from "../../../services/gestionUser/models/user";
import { UpdatePartner$Params } from "../../../services/gestionUser/fn/partner-controller/update-partner";
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { API_BASE_URL } from "../constants/api";
import {
  AuthenticationControllerService
} from "../../../services/gestionUser/services/authentication-controller.service";

@Component({
  selector: 'app-editmyprofilepartner',
  templateUrl: './editmyprofilepartner.component.html',
  styleUrl: './editmyprofilepartner.component.scss'
})
export class EditmyprofilepartnerComponent implements OnInit, OnDestroy {
  partnerForm!: FormGroup;
  currentUser: User | null = null;
  partnerDetails: Partner | null = null;
  currentUserId: number | null = null;
  isLoading: boolean = true;
  submitError: string | null = null;
  loadAttempted: boolean = false;
  private subscriptions: Subscription[] = [];
  formInitialized: boolean = false;
  submitted = false;
  activeTab: number = 1;

  // Image handling properties
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;
  selectedFile: File | null = null;

  // Previous properties
  profileImagePreview: string | ArrayBuffer | null = null;

  // For password change
  passwordForm!: FormGroup;
  passwordChangeSubmitted = false;
  passwordChangeError: string | null = null;
  passwordChangeSuccess: string | null = null;
  passwordVisible = false;

  partnershipStatuses = [
    { value: 'PENDING', label: 'Pending', color: '#FFC107' }, // Yellow
    { value: 'ACTIVE', label: 'Active', color: '#28a745' },   // Green
    { value: 'INACTIVE', label: 'Inactive', color: '#6c757d' }, // Gray
    { value: 'SUSPENDED', label: 'Suspended', color: '#dc3545' }, // Red
    { value: 'TERMINATED', label: 'Terminated', color: '#343a40' } // Dark
  ];

  businessCategories = [
    { value: 'HOTEL', label: 'Hotel' },
    { value: 'RESTAURANT', label: 'Restaurant' },
    { value: 'TRAVEL_AGENCY', label: 'Travel Agency' },
    { value: 'TRANSPORT', label: 'Transport' },
    { value: 'TOURISM', label: 'Tourism' },
    { value: 'FOOD_SUPPLY', label: 'Food Supply' },
    { value: 'EVENT_PLANNING', label: 'Event Planning' },
    { value: 'RETAIL', label: 'Retail' },
    { value: 'E_COMMERCE', label: 'E-Commerce' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'FITNESS', label: 'Fitness' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'FINANCIAL_SERVICES', label: 'Financial Services' },
    { value: 'TECHNOLOGY', label: 'Technology' },
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'LEGAL_SERVICES', label: 'Legal Services' },
    { value: 'CONSULTING', label: 'Consulting' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'AGRICULTURE', label: 'Agriculture' },
    { value: 'MANUFACTURING', label: 'Manufacturing' },
    { value: 'REAL_ESTATE', label: 'Real Estate' },
    { value: 'BEAUTY_AND_WELLNESS', label: 'Beauty & Wellness' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'NON_PROFIT', label: 'Non-Profit' },
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
      private partnerService: PartnerControllerService,
      private currentuserService: CurrentuserService,
      private authService: AuthenticationControllerService, // Add this
      private fb: FormBuilder,
      private http: HttpClient // Added HttpClient
  ) {
    this.initializeForm();
    this.initializePasswordForm();
  }

  ngOnInit(): void {
    console.log('EditMyProfilePartnerComponent initialized');

    // Ne pas définir isLoading = false avant de charger les données
    this.isLoading = true;

    // Load current user data
    this.currentuserService.loadCurrentUser();

    // Subscribe to get current user information
    const userSubscription = this.currentuserService.getCurrentUser().subscribe((user: User | null) => {
      this.currentUser = user;
      if (user && user.id && user.role === 'PARTNER') {
        this.currentUserId = user.id;
        this.loadPartnerDetails(user.id);
      } else {
        // Ne définir l'erreur que si le chargement est terminé
        if (!this.isLoading) {
          this.submitError = "Current user is not a partner or not authenticated";
        }
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
    console.log('EditMyProfilePartnerComponent destroyed');
  }

  initializeForm(): void {
    if (this.formInitialized) {
      return;
    }

    this.partnerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      otherName: ['', [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z]*$')
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
      address: ['', Validators.required],
      country: ['', Validators.required],
      businessCategory: ['', Validators.required],
      partnerDescription: ['', Validators.required],
      websiteURL: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')],
      contractStartDate: ['', Validators.required],
      contractEndDate: [''],
      profilePicture: ['']
    });

    this.formInitialized = true;
    console.log('Form initialized with validations');
  }

  // Password validation methods
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

  loadPartnerDetails(userId: number): void {
    console.log('Loading partner details for ID:', userId);
    this.loadAttempted = true;
    this.isLoading = true;
    this.submitError = null; // Réinitialiser toute erreur précédente

    const subscription = this.partnerService.getPartnerById({ id: userId })
        .pipe(
            take(1),
            catchError(error => {
              console.error(`Error fetching partner with ID ${userId}:`, error);
              return throwError(() => new Error(`Failed to load partner: ${error.message || 'Server error'}`));
            }),
            finalize(() => {
              this.isLoading = false;
              console.log('Partner loading completed');
            })
        )
        .subscribe({
          next: (partner) => {
            if (!partner) {
              this.submitError = `No partner found with ID ${userId}`;
              console.error(this.submitError);
              return;
            }
            console.log('Partner data loaded successfully:', partner);
            this.partnerDetails = partner;
            this.populateForm(partner);

            // Set image URL from profile picture
            if (partner && partner.profilePicture) {
              this.imageUrl = `${this.apiBaseUrl}/uploads/${partner.profilePicture}`;
              this.profileImagePreview = this.imageUrl; // Keep backward compatibility
            }
          },
          error: (error) => {
            console.error('Error in partner details subscription:', error);
            this.submitError = `Failed to load partner data: ${error.message || 'Unknown error'}`;
          }
        });

    this.subscriptions.push(subscription);
  }

  populateForm(partner: Partner): void {
    if (!partner) {
      this.submitError = 'Partner data is missing or invalid';
      return;
    }

    console.log('Populating form with partner data:', JSON.stringify(partner));

    this.partnerForm.patchValue({
      name: partner.firstname || '',
      otherName: partner.lastname || '',
      email: partner.email || '',
      phoneNumber: partner.phoneNumber || '',
      address: partner.address || '',
      country: partner.country || '',
      businessCategory: partner.businessCategory || '',
      partnerDescription: partner.partnerDescription || '',
      websiteURL: partner.websiteURL || '',
      contractStartDate: partner.contractStartDate ? this.formatDate(partner.contractStartDate) : '',
      contractEndDate: partner.contractEndDate ? this.formatDate(partner.contractEndDate) : '',
      profilePicture: partner.profilePicture || ''
    });

    console.log('Form values after population:', this.partnerForm.value);
    this.partnerForm.markAsPristine();
  }

  formatDate(date: string | Date): string {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    return d.toISOString().split('T')[0];
  }

  onUpdate(): void {
    this.submitted = true;

    if (!this.partnerDetails || this.currentUserId === null) {
      console.error('Cannot update: Partner data is not available');
      this.submitError = 'Cannot update: Partner data is not available';
      return;
    }

    if (this.partnerForm.invalid) {
      Object.keys(this.partnerForm.controls).forEach(key => {
        this.partnerForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid, cannot submit');
      return;
    }

    const formValues = this.partnerForm.value;
    console.log('Form values to submit:', formValues);

    // Creating an object that matches the structure expected by the API
    const updateData = {
      firstname: formValues.name,
      lastname: formValues.otherName,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      address: formValues.address,
      country: formValues.country,
      partnershipStatus: this.partnerDetails.partnershipStatus, // Maintain existing status
      businessCategory: formValues.businessCategory,
      partnerDescription: formValues.partnerDescription,
      websiteURL: formValues.websiteURL,
      contractStartDate: formValues.contractStartDate,
      contractEndDate: formValues.contractEndDate,
      profilePicture: formValues.profilePicture
    };

    const updateParams: UpdatePartner$Params = {
      id: this.currentUserId,
      body: updateData
    };

    this.isLoading = true;
    console.log('Updating partner with params:', updateParams);

    const subscription = this.partnerService.updatePartner(updateParams)
        .pipe(
            take(1),
            catchError(error => {
              console.error(`Error updating partner with ID ${this.currentUserId}:`, error);
              return throwError(() => new Error(`Failed to update partner: ${error.message || 'Server error'}`));
            }),
            finalize(() => {
              // Don't set isLoading to false here in case we need to upload an image
              if (!this.selectedFile) {
                this.isLoading = false;
                console.log('Update process completed without image upload');
              }
            })
        )
        .subscribe({
          next: (updatedPartner) => {
            console.log('Partner updated successfully', updatedPartner);

            // Now upload the image if selected
            if (this.selectedFile) {
              this.uploadProfilePictureAfterUpdate();
            } else {
              // If no image to upload, finish the process
              this.isLoading = false;
              this.currentuserService.loadCurrentUser();
              this.router.navigate(['/front-office/myprofilepartner']);
            }
          },
          error: (error) => {
            console.error('Error in update partner subscription:', error);
            this.submitError = `Failed to update partner: ${error.message || 'Please try again.'}`;
            this.isLoading = false;
          }
        });

    this.subscriptions.push(subscription);
  }

  // onChangePassword(): void {
  //   this.passwordChangeSubmitted = true;
  //   this.passwordChangeError = null;
  //   this.passwordChangeSuccess = null;
  //
  //   if (this.passwordForm.invalid) {
  //     Object.keys(this.passwordForm.controls).forEach(key => {
  //       this.passwordForm.get(key)?.markAsTouched();
  //     });
  //     return;
  //   }
  //
  //   if (this.currentUserId === null) {
  //     this.passwordChangeError = 'User ID not available. Please log in again.';
  //     return;
  //   }
  //
  //   const { newPassword } = this.passwordForm.value;
  //   this.isLoading = true;
  //
  //   // Replace with actual password change API when available
  //   setTimeout(() => {
  //     this.isLoading = false;
  //     this.passwordChangeSuccess = 'Password changed successfully!';
  //     this.passwordForm.reset();
  //     this.passwordChangeSubmitted = false;
  //
  //     // Redirect to profile page after successful password change
  //     setTimeout(() => {
  //       this.router.navigate(['/front-office/myprofilepartner']);
  //     }, 2000);
  //   }, 1000);
  // }


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

  // New method for file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.profileImagePreview = this.imageUrl; // Keep backward compatibility
      };
      reader.readAsDataURL(file);
    }
  }

  // Legacy method - keep for backward compatibility
  onProfilePictureChange(event: any): void {
    const imageUrl = event.target.value;
    if (imageUrl) {
      this.profileImagePreview = imageUrl;
      this.imageUrl = imageUrl;
      this.partnerForm.patchValue({
        profilePicture: imageUrl
      });
    } else {
      this.profileImagePreview = null;
      this.imageUrl = null;
    }
  }

  // New method to handle image error
  handleImageError(): void {
    this.imageUrl = null;
    this.profileImagePreview = null;
  }

  // New method to upload profile picture after partner update
  uploadProfilePictureAfterUpdate(): void {
    if (this.selectedFile && this.currentUserId) {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Call service to upload profile picture using HttpClient directly
      const url = `${this.apiBaseUrl}/partners/update/${this.currentUserId}/profile-picture`;


      this.http.put<Partner>(url, formData)
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
            next: (updatedPartner) => {
              console.log('Profile picture updated successfully');
              this.currentuserService.loadCurrentUser();
              // Navigate only after the image upload is completed
              this.router.navigate(['/front-office/myprofilepartner']);
              this.selectedFile = null; // Reset selectedFile after upload
            },
            error: (error) => {
              console.error('Error in profile picture update:', error);
              this.submitError = 'Failed to update profile picture';
              // Even if there's an error with the image, we can redirect since user data was saved
              this.router.navigate(['/front-office/myprofilepartner']);
            }
          });
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.partnerForm.get(controlName);
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

  // Helper method to get the color for partnership status
  getPartnershipStatusLabel(status: string): string {
    const foundStatus = this.partnershipStatuses.find(s => s.value === status);
    return foundStatus ? foundStatus.label : 'Unknown';
  }

  // Helper method to get the color for partnership status
  getPartnershipStatusColor(status: string): string {
    const foundStatus = this.partnershipStatuses.find(s => s.value === status);
    return foundStatus ? foundStatus.color : '#6c757d'; // Default to gray if not found
  }

  onCancel(): void {
    this.router.navigate(['/front-office/myprofilepartner']);
  }
}