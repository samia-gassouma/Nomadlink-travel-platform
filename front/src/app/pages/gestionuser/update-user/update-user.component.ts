import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserControllerService } from "../../../services/gestionUser/services/user-controller.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../../services/gestionUser/models/user";
import { UpdateUser$Params } from "../../../services/gestionUser/fn/user-controller/update-user";
import { Subscription, throwError } from 'rxjs';
import { finalize, take, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  userId!: number;
  user!: User;
  isLoading: boolean = true;
  submitError: string | null = null;
  loadAttempted: boolean = false;
  private subscriptions: Subscription[] = [];
  formInitialized: boolean = false;
  submitted = false;

  // Image handling properties
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  apiBaseUrl = API_BASE_URL;

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
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserControllerService,
      private fb: FormBuilder,
      private http: HttpClient
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    console.log('UpdateUserComponent initialized');
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      const idParam = params.get('id');
      console.log('Route param id:', idParam);

      if (idParam && !isNaN(+idParam)) {
        this.userId = +idParam;
        this.loadUserDetails();
      } else {
        this.handleMissingId();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('UpdateUserComponent destroyed');
  }

  initializeForm(): void {
    if (this.formInitialized) {
      return;
    }

    // Update form field names to match HTML template
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
      gender: [''], // Will be mapped to genre in backend
      dateOfBirth: ['']
      // Note: profilePicture field removed as we'll handle it separately
    });

    this.formInitialized = true;
    console.log('Form initialized with validations');
  }

  populateForm(user: User): void {
    if (!user) {
      this.submitError = 'User data is missing or invalid';
      return;
    }

    console.log('Populating form with user data:', JSON.stringify(user));

    // Set profile image URL if available
    if (user.profilePicture) {
      this.imageUrl = `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
    }

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

  loadUserDetails(): void {
    if (!this.userId) {
      this.handleMissingId();
      return;
    }

    this.loadAttempted = true;
    this.isLoading = true;
    console.log('Loading user details for ID:', this.userId);

    const subscription = this.userService.getUserDetailsById({ id: this.userId })
        .pipe(
            take(1),
            catchError(error => {
              console.error(`Error fetching user with ID ${this.userId}:`, error);
              return throwError(() => new Error(`Failed to load user: ${error.message || 'Server error'}`));
            }),
            finalize(() => {
              this.isLoading = false;
              console.log('User loading completed');
            })
        )
        .subscribe({
          next: (user) => {
            if (!user) {
              this.submitError = `No user found with ID ${this.userId}`;
              console.error(this.submitError);
              return;
            }
            console.log('User data loaded successfully:', user);
            this.user = user;
            this.populateForm(user);
          },
          error: (error) => {
            console.error('Error in user details subscription:', error);
            this.submitError = `Failed to load user data: ${error.message || 'Unknown error'}`;
            setTimeout(() => this.navigateToUserList(), 3000);
          }
        });

    this.subscriptions.push(subscription);
  }

  handleMissingId(): void {
    console.error('No user ID provided in route or invalid ID');
    this.isLoading = false;
    this.submitError = 'Invalid user ID. Please return to the user list.';
    setTimeout(() => this.navigateToUserList(), 3000);
  }

  navigateToUserList(): void {
    console.log('Navigating back to user list');
    this.router.navigate(['/back-office/users']);
  }

  onUpdate(): void {
    this.submitted = true;

    if (this.loadAttempted && !this.user) {
      console.error('Cannot update: User data was not loaded successfully');
      this.submitError = 'Cannot update: User data was not loaded successfully';
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

    // Conserver l'image de profil existante si aucune nouvelle n'est sélectionnée
    const profilePicture = this.selectedFile ? undefined : this.user.profilePicture;

    // Map form fields back to backend expected structure
    const updateData = {
      firstname: formValues.firstName,
      lastname: formValues.lastName,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      address: formValues.address,
      country: formValues.country,
      genre: formValues.gender, // Map gender to genre
      dateOfBirth: formValues.dateOfBirth,
      profilePicture: profilePicture // Ajouter cette ligne pour préserver l'image existante
    };

    const updateParams: UpdateUser$Params = {
      id: this.userId,
      body: updateData
    };

    this.isLoading = true;
    console.log('Updating user with params:', updateParams);

    const subscription = this.userService.updateUser(updateParams)
        .pipe(
            take(1),
            catchError(error => {
              console.error(`Error updating user with ID ${this.userId}:`, error);
              return throwError(() => new Error(`Failed to update user: ${error.message || 'Server error'}`));
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
          next: (updatedUser) => {
            console.log('User updated successfully', updatedUser);

            // If there's a selected file, upload it after user update
            if (this.selectedFile) {
              this.uploadProfilePictureAfterUpdate();
            } else {
              // If no image to upload, simply navigate back to user list
              this.navigateToUserList();
            }
          },
          error: (error) => {
            console.error('Error in update user subscription:', error);
            this.submitError = `Failed to update user: ${error.message || 'Please try again.'}`;
            this.isLoading = false;
          }
        });

    this.subscriptions.push(subscription);
  }

  onCancel(): void {
    this.navigateToUserList();
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
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

  // Upload profile picture after user update
  uploadProfilePictureAfterUpdate(): void {
    if (this.selectedFile && this.userId) {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Call API to upload profile picture
      const url = `${this.apiBaseUrl}/users/update/${this.userId}/profile-picture`;

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
              this.selectedFile = null; // Reset selected file after upload
              this.navigateToUserList();
            },
            error: (error) => {
              console.error('Error in profile picture update:', error);
              this.submitError = 'Failed to update profile picture, but user data was saved.';
              // Navigate back to user list anyway since user data was updated
              setTimeout(() => this.navigateToUserList(), 2000);
            }
          });
    }
  }
}