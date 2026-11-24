import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { AuthenticationControllerService } from "../../../services/gestionUser/services/authentication-controller.service";
import { PartnerDto } from "../../../services/gestionUser/models/partner-dto";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-registerpartner',
  templateUrl: './registerpartner.component.html',
  styleUrls: ['./registerpartner.component.scss']
})
export class RegisterpartnerComponent implements OnInit {
  createPartnerForm: FormGroup;
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  passwordVisible = false;
  apiBaseUrl = API_BASE_URL;

  // Add image handling properties
  selectedFile: File | null = null;
  profileImagePreview: string | ArrayBuffer | null = null;

  // Add password strength tracking properties
  passwordStrengthValid = {
    upperCase: false,
    lowerCase: false,
    numeric: false,
    specialChar: false,
    minLength: false
  };

  businessCategories = [
    // Same as before - business categories list
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
    // Same as before - countries list
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
      private fb: FormBuilder,
      private authService: AuthenticationControllerService,
      private router: Router,
      private http: HttpClient // Add HttpClient for image upload
  ) {
    this.createPartnerForm = this.fb.group({
      firstname: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      lastname: ['', [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z]*$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
        // Password validators handled manually
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ]],
      address: [''],
      country: ['', Validators.required],
      dateOfBirth: [''],
      partnershipStatus: ['PENDING'],
      businessCategory: ['', Validators.required],
      partnerDescription: ['', Validators.required],
      websiteURL: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')],
      contractStartDate: ['', Validators.required],
      contractEndDate: ['']
      // Remove profilePicture from form as we'll handle it separately
    });

    // Add listener to password field to update strength indicators
    this.createPartnerForm.get('password')?.valueChanges.subscribe(value => {
      this.updatePasswordStrength(value);
    });
  }

  ngOnInit(): void {
    // Initialization code if needed
  }

  // Update password strength indicators without affecting form validity
  updatePasswordStrength(password: string): void {
    if (!password) {
      Object.keys(this.passwordStrengthValid).forEach(key => {
        this.passwordStrengthValid[key as keyof typeof this.passwordStrengthValid] = false;
      });
      return;
    }

    this.passwordStrengthValid.upperCase = /[A-Z]/.test(password);
    this.passwordStrengthValid.lowerCase = /[a-z]/.test(password);
    this.passwordStrengthValid.numeric = /[0-9]/.test(password);
    this.passwordStrengthValid.specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    this.passwordStrengthValid.minLength = password.length >= 8;

    // Update the form control validity only if length is at least 8
    if (password.length >= 8) {
      const allValid = Object.values(this.passwordStrengthValid).every(value => value === true);
      if (allValid) {
        this.createPartnerForm.get('password')?.setErrors(null);
      } else {
        this.createPartnerForm.get('password')?.setErrors({ passwordRequirements: true });
      }
    }
  }

  // Check if password strength criteria is met
  isPasswordStrengthValid(): boolean {
    return Object.values(this.passwordStrengthValid).every(value => value === true);
  }

  // Used to check individual password strength criteria
  hasPasswordStrengthError(criteria: keyof typeof this.passwordStrengthValid): boolean {
    return !this.passwordStrengthValid[criteria];
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.submitted = true;

    // Check password strength manually before submission
    const password = this.createPartnerForm.get('password')?.value;
    this.updatePasswordStrength(password);

    if (!this.isPasswordStrengthValid()) {
      this.createPartnerForm.get('password')?.setErrors({ passwordRequirements: true });
    }

    if (this.createPartnerForm.invalid) {
      // Mark all fields as touched to display errors
      Object.keys(this.createPartnerForm.controls).forEach(key => {
        const control = this.createPartnerForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const partnerDto: PartnerDto = this.createPartnerForm.value;

    this.authService.createPartner({ body: partnerDto }).subscribe({
      next: (response) => {
        // If an image file has been selected, upload it after partner creation
        if (this.selectedFile && response.id) {
          this.uploadProfilePicture(response.id);
        } else {
          // Navigate to activate account page
          this.router.navigate(['activate-account']);
        }
      },
      error: (error) => {
        // Check if the error is related to email already existing
        if (error.error?.message?.toLowerCase().includes('email') &&
            error.error?.message?.toLowerCase().includes('exist')) {
          // Set specific error for the email field
          this.createPartnerForm.get('email')?.setErrors({ emailExists: true });
          this.errorMessage = 'This email address is already registered in our system.';
        } else {
          this.errorMessage = error.error?.message || "Error creating partner.";
        }

        this.successMessage = '';
        this.loading = false;
        console.error(error);

        // Auto-clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  // Method to handle image upload
  uploadProfilePicture(partnerId: number): void {
    if (!this.selectedFile || !partnerId) {
      this.router.navigate(['activate-account']);
      return;
    }

    // Create FormData object to send file
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Call API to upload profile picture
    const url = `${this.apiBaseUrl}/auth/partner/${partnerId}/profile-picture`;

    this.http.post<any>(url, formData)
        .pipe(
            finalize(() => {
              this.loading = false;
              // Navigate to activate account page after upload completes
              this.router.navigate(['activate-account']);
            })
        )
        .subscribe({
          next: (response) => {
            console.log('Profile picture uploaded successfully', response);
          },
          error: (error) => {
            console.error('Error uploading profile picture:', error);
          }
        });
  }

  // Helper method to check for email exists error
  hasEmailExistsError(): boolean {
    const emailControl = this.createPartnerForm.get('email');
    return !!(emailControl && emailControl.hasError('emailExists'));
  }

  // Helper methods for validations in template
  hasError(controlName: string, errorName: string): boolean {
    const control = this.createPartnerForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }

  resetForm(): void {
    this.createPartnerForm.reset({
      partnershipStatus: 'PENDING'
    });
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.profileImagePreview = null;
    this.selectedFile = null;

    // Reset password strength indicators
    Object.keys(this.passwordStrengthValid).forEach(key => {
      this.passwordStrengthValid[key as keyof typeof this.passwordStrengthValid] = false;
    });
  }

  // New method to handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle image loading errors
  handleImageError(): void {
    this.profileImagePreview = null;
  }

  // Navigation methods
  login(): void {
    this.router.navigate(['/login']);
  }

  registerAsUser(): void {
    this.router.navigate(['/register']);
  }
}