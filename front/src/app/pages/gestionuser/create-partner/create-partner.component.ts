import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import {AuthenticationControllerService} from "../../../services/gestionUser/services/authentication-controller.service";
import { PartnerDto} from "../../../services/gestionUser/models/partner-dto";
import {API_BASE_URL} from "../constants/api";
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router } from "@angular/router";

@Component({
    selector: 'app-create-partner',
    templateUrl: './create-partner.component.html',
    styleUrls: ['./create-partner.component.scss']
})
export class CreatePartnerComponent implements OnInit {
    createPartnerForm: FormGroup;
    submitted = false;
    loading = false;
    successMessage: string | null = null;  // Change to null type like user component
    errorMessage: string | null = null;    // Change to null type like user component
    passwordVisible = false;

    // Image handling properties exactly like in user component
    selectedFile: File | null = null;
    imageUrl: string | ArrayBuffer | null = null;
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
        private fb: FormBuilder,
        private authService: AuthenticationControllerService,
        private http: HttpClient,
        private router: Router // Add router for navigation
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
                Validators.minLength(8),
                this.hasUpperCase,
                this.hasLowerCase,
                this.hasNumeric,
                this.hasSpecialChar
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
            contractEndDate: [''],
            // Note: removed profilePicture from the form as we'll handle it separately
        });
    }

    ngOnInit(): void {
        // Initialization code if needed
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

    hasPasswordError(errorType: string): boolean {
        const control = this.createPartnerForm.get('password');
        return !!(control && control.touched && control.hasError(errorType));
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    getStatusColor(status: string): string {
        const statusObj = this.partnershipStatuses.find(s => s.value === status);
        return statusObj ? statusObj.color : '#6c757d'; // Default to gray if not found
    }

    onSubmit(): void {
        this.submitted = true;

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
                    this.successMessage = 'Partner created successfully!';
                    this.errorMessage = null;
                    this.loading = false;

                    // Navigate to partners list after a short delay like in user component
                    setTimeout(() => {
                        this.router.navigate(['/back-office/partners']);
                    }, 2000);
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

                this.successMessage = null;
                this.loading = false;
                console.error(error);

                // Auto-clear error message after 5 seconds
                setTimeout(() => {
                    this.errorMessage = null;
                }, 5000);
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
        this.successMessage = null;
        this.errorMessage = null;
        this.imageUrl = null;
        this.selectedFile = null;
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;

            // Create preview URL for the selected image
            const reader = new FileReader();
            reader.onload = () => {
                this.imageUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    handleImageError(): void {
        this.imageUrl = null;
    }

    // Modified method that exactly follows the user implementation pattern
    uploadProfilePicture(partnerId: number): void {
        if (!this.selectedFile || !partnerId) {
            this.router.navigate(['/back-office/partners']);
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
                    this.successMessage = 'Partner created successfully!';
                    setTimeout(() => {
                        this.router.navigate(['/back-office/partners']);
                    }, 2000);
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
    navigateToPartnerList(): void {
        console.log('Navigating back to partner list');
        this.router.navigate(['/back-office/partners']);
    }

    // Cancel button handler
    onCancel(): void {
        this.navigateToPartnerList();
    }
}