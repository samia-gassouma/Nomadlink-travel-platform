import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize, take, catchError } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { Services } from "../../../services/gestionUser/models/services";
import { API_BASE_URL } from "../constants/api";
@Component({
  selector: 'app-updatemyservicespartner',
  templateUrl: './updatemyservicespartner.component.html',
  styleUrl: './updatemyservicespartner.component.scss'
})
export class UpdatemyservicespartnerComponent implements OnInit, OnDestroy {
  serviceForm!: FormGroup;
  serviceId!: number;
  service!: Services;
  isLoading: boolean = true;
  submitError: string | null = null;
  successMessage: string | null = null;
  loadAttempted: boolean = false;
  formInitialized: boolean = false;
  submitted = false;

  // Image handling properties
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  apiBaseUrl = API_BASE_URL;

  // Service categories from your enum
  serviceCategories = [
    'ACCOMMODATION', 'TRANSPORT', 'TOUR_GUIDE', 'ACTIVITY',
    'RESTAURANT', 'WELLNESS', 'ENTERTAINMENT', 'SHOPPING',
    'ADVENTURE', 'EVENT', 'SPORTS', 'CRUISE', 'CULTURE',
    'EQUIPMENT_RENTAL', 'TRAVEL_INSURANCE', 'OTHER'
  ];

  private subscriptions: Subscription[] = [];

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private serviceController: ServiceControllerService,
      private fb: FormBuilder,
      private http: HttpClient
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    console.log('UpdateServiceComponent initialized');
    this.route.paramMap.pipe(take(1)).subscribe(params => {
      const idParam = params.get('id');
      console.log('Route param id:', idParam);

      if (idParam && !isNaN(+idParam)) {
        this.serviceId = +idParam;
        this.loadServiceDetails();
      } else {
        this.handleMissingId();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('UpdateServiceComponent destroyed');
  }

  initializeForm(): void {
    if (this.formInitialized) {
      return;
    }

    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      status: ['DISPONIBLE']
    });

    this.formInitialized = true;
    console.log('Form initialized with validations');
  }

  populateForm(service: Services): void {
    if (!service) {
      this.submitError = 'Service data is missing or invalid';
      return;
    }

    console.log('Populating form with service data:', JSON.stringify(service));

    // Set service image URL if available
    if (service.imageUrl) {
      this.imageUrl = `${this.apiBaseUrl}/uploads/${service.imageUrl}`;
    }

    this.serviceForm.patchValue({
      name: service.name || '',
      description: service.description || '',
      price: service.price || 0,
      category: service.category || '',
      status: service.status || 'DISPONIBLE'
    });

    console.log('Form values after population:', this.serviceForm.value);
    this.serviceForm.markAsPristine();
  }

  loadServiceDetails(): void {
    if (!this.serviceId) {
      this.handleMissingId();
      return;
    }

    this.loadAttempted = true;
    this.isLoading = true;
    console.log('Loading service details for ID:', this.serviceId);

    const subscription = this.serviceController.getServiceById({ id: this.serviceId })
        .pipe(
            take(1),
            catchError(error => {
              console.error(`Error fetching service with ID ${this.serviceId}:`, error);
              return throwError(() => new Error(`Failed to load service: ${error.message || 'Server error'}`));
            }),
            finalize(() => {
              this.isLoading = false;
              console.log('Service loading completed');
            })
        )
        .subscribe({
          next: (service) => {
            if (!service) {
              this.submitError = `No service found with ID ${this.serviceId}`;
              console.error(this.submitError);
              return;
            }
            console.log('Service data loaded successfully:', service);
            this.service = service;
            this.populateForm(service);
          },
          error: (error) => {
            console.error('Error in service details subscription:', error);
            this.submitError = `Failed to load service data: ${error.message || 'Unknown error'}`;
            setTimeout(() => this.navigateToServiceList(), 3000);
          }
        });

    this.subscriptions.push(subscription);
  }

  handleMissingId(): void {
    console.error('No service ID provided in route or invalid ID');
    this.isLoading = false;
    this.submitError = 'Invalid service ID. Please return to the service list.';
    setTimeout(() => this.navigateToServiceList(), 3000);
  }

  navigateToServiceList(): void {
    console.log('Navigating back to service list');
    this.router.navigate(['/front-office/myprofilepartner']);
  }

  onUpdate(): void {
    this.submitted = true;

    if (this.loadAttempted && !this.service) {
      console.error('Cannot update: Service data was not loaded successfully');
      this.submitError = 'Cannot update: Service data was not loaded successfully';
      return;
    }

    if (this.serviceForm.invalid) {
      Object.keys(this.serviceForm.controls).forEach(key => {
        this.serviceForm.get(key)?.markAsTouched();
      });
      console.log('Form is invalid, cannot submit');
      return;
    }

    const formValues = this.serviceForm.value;
    console.log('Form values to submit:', formValues);

    // Keep existing image if no new one is selected
    const imageUrl = this.selectedFile ? undefined : this.service.imageUrl;

    const updateData = {
      name: formValues.name,
      description: formValues.description,
      price: formValues.price,
      category: formValues.category,
      status: formValues.status,
      imageUrl: imageUrl
    };

    this.isLoading = true;
    console.log('Updating service with ID:', this.serviceId);

    const subscription = this.serviceController.updateService({
      id: this.serviceId,
      body: updateData
    })
        .pipe(
            take(1),
            catchError(error => {
              console.error(`Error updating service with ID ${this.serviceId}:`, error);
              return throwError(() => new Error(`Failed to update service: ${error.message || 'Server error'}`));
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
          next: (updatedService) => {
            console.log('Service updated successfully', updatedService);

            // If there's a selected file, upload it after service update
            if (this.selectedFile) {
              this.uploadServiceImageAfterUpdate();
            } else {
              // If no image to upload, show success message and navigate
              this.successMessage = 'Service updated successfully!';
              setTimeout(() => this.navigateToServiceList(), 2000);
            }
          },
          error: (error) => {
            console.error('Error in update service subscription:', error);
            this.submitError = `Failed to update service: ${error.message || 'Please try again.'}`;
            this.isLoading = false;
          }
        });

    this.subscriptions.push(subscription);
  }

  onCancel(): void {
    this.navigateToServiceList();
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.serviceForm.get(controlName);
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

  // Upload service image after service update
  uploadServiceImageAfterUpdate(): void {
    if (this.selectedFile && this.serviceId) {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.put<Services>(`${this.apiBaseUrl}/services/update/${this.serviceId}/image`, formData)
          .pipe(
              take(1),
              catchError((error) => {
                console.error('Error uploading service image:', error);
                return throwError(() => new Error('Failed to upload service image'));
              }),
              finalize(() => {
                this.isLoading = false;
                console.log('Image upload process completed');
              })
          )
          .subscribe({
            next: (updatedService) => {
              console.log('Service image updated successfully');
              this.selectedFile = null; // Reset selected file after upload
              this.successMessage = 'Service updated successfully with image!';
              setTimeout(() => this.navigateToServiceList(), 2000);
            },
            error: (error) => {
              console.error('Error in service image update:', error);
              this.submitError = 'Failed to update service image, but service data was saved.';
              // Navigate back to service list anyway since service data was updated
              setTimeout(() => this.navigateToServiceList(), 2000);
            }
          });
    }
  }
}