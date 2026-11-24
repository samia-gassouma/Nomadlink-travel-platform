import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { AuthenticationControllerService } from "../../../services/gestionUser/services/authentication-controller.service";
import { CreateUserDto } from "../../../services/gestionUser/models/create-user-dto";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { API_BASE_URL } from "../constants/api";
import {AddProfilePicture2$Params} from "../../../services/gestionUser/fn/authentication-controller/add-profile-picture-2";
import {User} from "../../../services/gestionUser/models/user";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  createUserForm: FormGroup;
  submitted = false;
  loading = false;
  successMessage: string | null = null; // Add null to type
  errorMessage: string | null = null;   // Add null to type
  passwordVisible = false;

  // Image handling properties
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  apiBaseUrl = API_BASE_URL;

  genres = [
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
      private fb: FormBuilder,
      private authService: AuthenticationControllerService,
      private router: Router,
      private http: HttpClient
  ) {
    this.createUserForm = this.fb.group({
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
      genre: ['OTHER']
      // Remarque: Nous ne mettons pas profilePicture dans le formulaire car nous le gérerons séparément
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
    const control = this.createUserForm.get('password');
    return !!(control && control.touched && control.hasError(errorType));
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.createUserForm.invalid) {
      // Mark all fields as touched to display errors
      Object.keys(this.createUserForm.controls).forEach(key => {
        const control = this.createUserForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const userDto: CreateUserDto = {
      ...this.createUserForm.value,
      firstname: this.createUserForm.value.firstName,
      lastname: this.createUserForm.value.lastName
    };

    this.authService.createUser({ body: userDto }).subscribe({
      next: (response) => {
        // Si un fichier image a été sélectionné, l'uploader après la création de l'utilisateur
        if (this.selectedFile && response.id) {
          this.uploadProfilePicture(response.id);
        } else {

          this.router.navigate(['/back-office/users']);
        }
      },
      error: (error) => {
        // Check if the error is related to email already existing
        if (error.error?.message?.toLowerCase().includes('email') &&
            error.error?.message?.toLowerCase().includes('exist')) {
          // Set specific error for the email field
          this.createUserForm.get('email')?.setErrors({ emailExists: true });
          this.errorMessage = 'This email address is already registered in our system.';
        } else {
          this.errorMessage = error.error?.message || "Error creating user.";
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

  // Méthode pour télécharger l'image de profil après création de l'utilisateur
  uploadProfilePicture(userId: number): void {
    if (!this.selectedFile || !userId) {
      this.router.navigate(['/back-office/users']);
      return;
    }

    // Create FormData object to send file
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Call API to upload profile picture
    const url = `${this.apiBaseUrl}/auth/user/${userId}/profile-picture`;

    this.http.post<User>(url, formData)
        .pipe(
            finalize(() => {
              this.loading = false;
              this.successMessage = 'User created successfully!';

              // Navigate after a short delay to show success message
              setTimeout(() => {
                this.router.navigate(['/back-office/users']);
              }, 2000);
            })
        )
        .subscribe({
          next: (response) => {
            console.log('Profile picture uploaded successfully', response);
          },
          error: (error) => {
            console.error('Error uploading profile picture:', error);
            // Still navigate to users page since the user was created successfully
          }
        });
  }
  // Helper method to check for email exists error
  hasEmailExistsError(): boolean {
    const emailControl = this.createUserForm.get('email');
    return !!(emailControl && emailControl.hasError('emailExists'));
  }

  // Helper methods for validations in template
  hasError(controlName: string, errorName: string): boolean {
    const control = this.createUserForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }

  resetForm(): void {
    this.createUserForm.reset({
      genre: 'OTHER',
    });
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.imageUrl = null;
    this.selectedFile = null;
  }

  // Méthode pour gérer la sélection d'un fichier image
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Créer une URL de prévisualisation pour l'image sélectionnée
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Gérer les erreurs d'image
  handleImageError(): void {
    this.imageUrl = null;
  }
  onCancel(): void {
    this.navigateToUserList();
  }
  navigateToUserList(): void {
    console.log('Navigating back to user list');
    this.router.navigate(['/back-office/users']);
  }
}