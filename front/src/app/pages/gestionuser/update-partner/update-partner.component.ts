import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { Partner } from "../../../services/gestionUser/models/partner";
import { PartnerControllerService } from "../../../services/gestionUser/services/partner-controller.service";
import { UpdatePartner$Params } from "../../../services/gestionUser/fn/partner-controller/update-partner";
import { Subscription, throwError } from 'rxjs';
import { finalize, take, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-update-partner',
  templateUrl: './update-partner.component.html',
  styleUrls: ['./update-partner.component.scss']
})
export class UpdatePartnerComponent implements OnInit, OnDestroy {
  partnerForm!: FormGroup;
  partnerId!: number;
  partner!: Partner;
  isLoading: boolean = true;
  submitError: string | null = null;
  loadAttempted: boolean = false; // Flag to track if loading was attempted
  private subscriptions: Subscription[] = [];
  formInitialized: boolean = false;
  submitted = false;

  // Image handling properties
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  apiBaseUrl = API_BASE_URL;

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
      private route: ActivatedRoute,
      private router: Router,
      private partnerService: PartnerControllerService,
      private fb: FormBuilder,
      private http: HttpClient
  ) {
    // Initialize the form in constructor to ensure it exists
    this.initializeForm();
  }

  ngOnInit(): void {
    console.log('UpdatePartnerComponent initialized');
    // Get the partner ID from the route parameters and load partner data
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      const idParam = params.get('id');
      console.log('Route param id:', idParam);

      if (idParam && !isNaN(+idParam)) {
        this.partnerId = +idParam;
        this.loadPartnerDetails();
      } else {
        this.handleMissingId();
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('UpdatePartnerComponent destroyed');
  }

  initializeForm(): void {
    if (this.formInitialized) {
      return; // Prevent reinitializing the form if already done
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
      partnershipStatus: [''],
      businessCategory: ['', Validators.required],
      partnerDescription: ['', Validators.required],
      websiteURL: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')],
      contractStartDate: ['', Validators.required],
      contractEndDate: ['']
      // profilePicture field removed as we'll handle it separately like in UpdateUserComponent
    });

    this.formInitialized = true;
    console.log('Form initialized with validations');
  }

  populateForm(partner: Partner): void {
    if (!partner) {
      this.submitError = 'Partner data is missing or invalid';
      return;
    }

    console.log('Populating form with partner data (raw):', JSON.stringify(partner));

    // Set profile image URL if available
    if (partner.profilePicture) {
      this.imageUrl = `${this.apiBaseUrl}/uploads/${partner.profilePicture}`;
    }

    this.partnerForm.patchValue({
      name: partner.firstname || '',
      otherName: partner.lastname || '',
      email: partner.email || '',
      phoneNumber: partner.phoneNumber || '',
      address: partner.address || '',
      country: partner.country || '',
      partnershipStatus: partner.partnershipStatus || 'PENDING',
      businessCategory: partner.businessCategory || '',
      partnerDescription: partner.partnerDescription || '',
      websiteURL: partner.websiteURL || '',
      contractStartDate: partner.contractStartDate ? this.formatDate(partner.contractStartDate) : '',
      contractEndDate: partner.contractEndDate ? this.formatDate(partner.contractEndDate) : ''
    });

    console.log('Form values after population:', this.partnerForm.value);
    this.partnerForm.markAsPristine(); // Mark as pristine after populating
  }

  formatDate(date: string | Date): string {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    return d.toISOString().split('T')[0];
  }

  loadPartnerDetails(): void {
    if (!this.partnerId) {
      this.handleMissingId();
      return;
    }

    // Set a flag to indicate that loading was attempted
    this.loadAttempted = true;
    this.isLoading = true;
    console.log('Loading partner details for ID:', this.partnerId);

    const subscription = this.partnerService.getPartnerById({ id: this.partnerId })
        .pipe(
            take(1), // Ensure the observable completes after one emission
            // Capture and handle HTTP errors
            catchError(error => {
              console.error(`Error fetching partner with ID ${this.partnerId}:`, error);
              // Stop component execution by returning an error
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
              this.submitError = `No partner found with ID ${this.partnerId}`;
              console.error(this.submitError);
              return;
            }
            console.log('Partner data loaded successfully:', partner);
            this.partner = partner;
            this.populateForm(partner);
          },
          error: (error) => {
            console.error('Error in partner details subscription:', error);
            this.submitError = `Failed to load partner data: ${error.message || 'Unknown error'}`;
            // Redirect to the partner list after a delay
            setTimeout(() => this.navigateToPartnerList(), 3000);
          }
        });

    this.subscriptions.push(subscription);
  }

  handleMissingId(): void {
    console.error('No partner ID provided in route or invalid ID');
    this.isLoading = false;
    this.submitError = 'Invalid partner ID. Please return to the partner list.';
    // Redirect to the partner list after a delay
    setTimeout(() => this.navigateToPartnerList(), 3000);
  }

  // Helper method to navigate back to partner list
  navigateToPartnerList(): void {
    console.log('Navigating back to partner list');
    this.router.navigate(['/back-office//partners']);
  }

  onUpdate(): void {
    this.submitted = true;

    // Check if loading was attempted but failed
    if (this.loadAttempted && !this.partner) {
      console.error('Cannot update: Partner data was not loaded successfully');
      this.submitError = 'Cannot update: Partner data was not loaded successfully';
      return;
    }

    if (this.partnerForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.partnerForm.controls).forEach(key => {
        this.partnerForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid, cannot submit');
      return;
    }

    // Create a clean update object with only the form values
    const formValues = this.partnerForm.value;
    console.log('Form values to submit:', formValues);

    // Keep existing profile picture if no new one is selected
    const profilePicture = this.selectedFile ? undefined : this.partner.profilePicture;

    // Creating an object that matches the structure expected by the API
    const updateData = {
      firstname: formValues.name,
      lastname: formValues.otherName,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      address: formValues.address,
      country: formValues.country,
      partnershipStatus: formValues.partnershipStatus,
      businessCategory: formValues.businessCategory,
      partnerDescription: formValues.partnerDescription,
      websiteURL: formValues.websiteURL,
      contractStartDate: formValues.contractStartDate,
      contractEndDate: formValues.contractEndDate,
      profilePicture: profilePicture // Preserve existing image
    };

    const updateParams: UpdatePartner$Params = {
      id: this.partnerId,
      body: updateData
    };

    this.isLoading = true;
    console.log('Updating partner with params:', updateParams);

    const subscription = this.partnerService.updatePartner(updateParams)
        .pipe(
            take(1),
            catchError(error => {
              console.error(`Error updating partner with ID ${this.partnerId}:`, error);
              return throwError(() => new Error(`Failed to update partner: ${error.message || 'Server error'}`));
            }),
            finalize(() => {
              // Don't finalize loading state here if we have an image to upload
              if (!this.selectedFile) {
                this.isLoading = false;
                console.log('Update process completed without image upload');
              }
            })
        )
        .subscribe({
          next: (updatedPartner) => {
            console.log('Partner updated successfully', updatedPartner);

            // If there's a selected file, upload it after partner update
            if (this.selectedFile) {
              this.uploadProfilePictureAfterUpdate();
            } else {
              // If no image to upload, simply navigate back to partner list
              this.navigateToPartnerList();
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

  onCancel(): void {
    this.navigateToPartnerList();
  }

  // Helper methods for template validations
  hasError(controlName: string, errorName: string): boolean {
    const control = this.partnerForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }

  // File selection handler
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
    }
  }

  // Handle image error
  handleImageError(): void {
    this.imageUrl = null;
  }

  // Upload profile picture after partner update
  uploadProfilePictureAfterUpdate(): void {
    if (this.selectedFile && this.partnerId) {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Call API to upload profile picture
      const url = `${this.apiBaseUrl}/partners/update/${this.partnerId}/profile-picture`;

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
              this.selectedFile = null; // Reset selected file after upload
              this.navigateToPartnerList();
            },
            error: (error) => {
              console.error('Error in profile picture update:', error);
              this.submitError = 'Failed to update profile picture, but partner data was saved.';
              // Navigate back to partner list anyway since partner data was updated
              setTimeout(() => this.navigateToPartnerList(), 2000);
            }
          });
    }
  }

  // Method to get status color for partnership status
  getStatusColor(status: string): string {
    const statusObj = this.partnershipStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : '#6c757d'; // Default to gray if not found
  }
}