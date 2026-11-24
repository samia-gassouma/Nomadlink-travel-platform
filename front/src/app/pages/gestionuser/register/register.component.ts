import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { AuthenticationControllerService } from "../../../services/gestionUser/services/authentication-controller.service";
import { CreateUserDto } from "../../../services/gestionUser/models/create-user-dto";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { API_BASE_URL } from "../constants/api";
import { RewardPointsService } from 'src/app/front-office/services/reward-points/reward-points.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  createUserForm: FormGroup;
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  passwordVisible = false;
  apiBaseUrl = API_BASE_URL;

  // Image handling properties
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  // Add password strength tracking properties
  passwordStrengthValid = {
    upperCase: false,
    lowerCase: false,
    numeric: false,
    specialChar: false,
    minLength: false
  };

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

  // Nouvelles propriétés pour SightEngine
  sightengineApiUser = '388139849';
  sightengineApiSecret = 'vwMUSabuvrGH9N5XXUzoewMBfUGgLBgj';
  isCheckingImage = false;
  imageCheckError = '';


  constructor(
      private fb: FormBuilder,
      private authService: AuthenticationControllerService,
      private router: Router,
      private http: HttpClient,
      private _pointsService: RewardPointsService
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
        Validators.minLength(8)
        // Password strength checks are done separately
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ]],
      address: [''],
      country: ['', Validators.required],
      dateOfBirth: [''],
      genre: ['OTHER']
      // Not including profilePicture in the form as we'll handle it separately
    });

    // Add listener to password field to update strength indicators
    this.createUserForm.get('password')?.valueChanges.subscribe(value => {
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
        this.createUserForm.get('password')?.setErrors(null);
      } else {
        this.createUserForm.get('password')?.setErrors({ passwordRequirements: true });
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
    let idUser: number = 0;
    // Check password strength manually before submission
    const password = this.createUserForm.get('password')?.value;
    this.updatePasswordStrength(password);

    if (!this.isPasswordStrengthValid()) {
      this.createUserForm.get('password')?.setErrors({ passwordRequirements: true });
    }

    // Add this check to prevent form submission when image is inappropriate
    if (this.imageCheckError) {
      this.errorMessage = this.imageCheckError;
      this.loading = false;
      return;
    }

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
        // If a file image has been selected, upload it after creating the user
        if (this.selectedFile && response.id) {
          this.uploadProfilePicture(response.id);
          idUser = response.id;
          this._pointsService.add(idUser).subscribe();
        } else {
          // Navigate to activate account page if no image to upload
          this.router.navigate(['activate-account']);
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

  // Method to upload profile picture after user creation
  uploadProfilePicture(userId: number): void {
    if (!this.selectedFile || !userId) {
      this.router.navigate(['activate-account']);
      return;
    }

    // Create FormData object to send file
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Call API to upload profile picture
    const url = `${this.apiBaseUrl}/auth/user/${userId}/profile-picture`;

    this.http.post(url, formData)
        .pipe(
            finalize(() => {
              this.loading = false;
              this.successMessage = 'Account created successfully! Please check your email to activate your account.';

              // Navigate after a short delay to show success message
              setTimeout(() => {
                this.router.navigate(['activate-account']);
              }, 2000);
            })
        )
        .subscribe({
          next: () => {
            console.log('Profile picture uploaded successfully');
          },
          error: (error) => {
            console.error('Error uploading profile picture:', error);
            // Still navigate to activate account page since the user was created successfully
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

    // Reset password strength indicators
    Object.keys(this.passwordStrengthValid).forEach(key => {
      this.passwordStrengthValid[key as keyof typeof this.passwordStrengthValid] = false;
    });
  }

  // Method to handle file selection for profile picture
  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //
  //     // Create preview URL for the selected image
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imageUrl = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // Modifions la méthode onFileSelected pour vérifier l'image
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Réinitialiser les états d'erreur
      this.imageCheckError = '';
      this.isCheckingImage = true;

      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);

      // Vérifier l'image avec SightEngine avant de l'accepter
      this.checkImageWithSightEngine(file);
    }
  }

  // Handle image loading errors
  handleImageError(): void {
    this.imageUrl = null;
  }

  login() {
    this.router.navigate(['login']);
  }

  registerAsPartner() {
    this.router.navigate(['register-partner']);
  }

  checkImageWithSightEngine(file: File): void {
    this.isCheckingImage = true;
    this.imageCheckError = ''; // Clear previous errors

    console.log('Checking image with SightEngine:', file.name, file.type, file.size);

    const formData = new FormData();
    formData.append('media', file);
    formData.append('api_user', this.sightengineApiUser);
    formData.append('api_secret', this.sightengineApiSecret);
    formData.append('models', 'nudity,wad,offensive,gore,weapon,tobacco');
    this.http.post('https://api.sightengine.com/1.0/check.json', formData)
        .pipe(
            finalize(() => {
              this.isCheckingImage = false;
            })
        )
        .subscribe({
          next: (response: any) => {
            console.log('SightEngine API response:', response);

            if (this.isInappropriateImage(response)) {
              this.selectedFile = null;
              this.imageUrl = null;
              this.imageCheckError = 'This image contains content that violates our community guidelines. Please select another image.';

              // Auto-clear error after 5 seconds
              setTimeout(() => {
                this.imageCheckError = '';
              }, 5000);
            } else {
              this.selectedFile = file;
              console.log('Image passed safety check');
            }
          },
          error: (error) => {
            console.error('SightEngine API error:', error);

            // If the API call fails, we should still allow the image
            // assuming it's an API issue rather than an inappropriate image
            this.selectedFile = file;

            // Optional: Show a warning that the safety check couldn't be performed
            this.imageCheckError = 'Image safety check couldn\'t be completed, but your image has been accepted.';
            setTimeout(() => {
              this.imageCheckError = '';
            }, 5000);
          }
        });
  }

  handleInappropriateImage(): void {
    this.selectedFile = null;
    this.imageUrl = null;
    this.imageCheckError = 'This image contains inappropriate content that violates our community guidelines. Please select another image.';
    this.createUserForm.setErrors({ inappropriateImage: true });
  }


  isInappropriateImage(result: any): boolean {
    console.log('SightEngine response:', result);

    // Check if the response is valid
    if (!result || typeof result !== 'object') {
      console.error('Invalid SightEngine response');
      return true; // Fail safe - reject if invalid response
    }

    // Define thresholds
    const thresholds = {
      nudity: {
        raw: 0.3,
        partial: 0.4,
        safe: 0.6 // Lowered from 0.9 which was too strict
      },
      offensive: 0.5, // Increased from 0.4
      gore: 0.4,
      weapon: 0.3, // Increased from 0.2
      alcohol: 0.6, // Increased from 0.5
      drugs: 0.6,// Increased from 0.5
      tobacco: 0.5  // Add threshold for tobacco detection

    };

    // Check if nudity data exists before evaluating
    if (result.nudity) {
      if (
          (result.nudity.raw && result.nudity.raw > thresholds.nudity.raw) ||
          (result.nudity.partial && result.nudity.partial > thresholds.nudity.partial) ||
          (result.nudity.safe && result.nudity.safe < thresholds.nudity.safe)
      ) {
        console.log('Nudity detected', result.nudity);
        return true;
      }
    }

    // Check other properties only if they exist
    if (result.offensive && result.offensive.prob > thresholds.offensive) {
      console.log('Offensive content detected', result.offensive);
      return true;
    }

    if (result.gore && result.gore.prob > thresholds.gore) {
      console.log('Gore content detected', result.gore);
      return true;
    }

    if (result.weapon && result.weapon.prob > thresholds.weapon) {
      console.log('Weapon detected', result.weapon);
      return true;
    }

    if (result.alcohol && result.alcohol.prob > thresholds.alcohol) {
      console.log('Alcohol detected', result.alcohol);
      return true;
    }

    if (result.drugs && result.drugs.prob > thresholds.drugs) {
      console.log('Drugs detected', result.drugs);
      return true;
    }
    // Then add the tobacco detection check
    if (result.tobacco && result.tobacco.prob > thresholds.tobacco) {
      console.log('Tobacco detected', result.tobacco);
      return true;
    }

    return false; // Image is appropriate
  }

}