import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { HttpErrorResponse } from '@angular/common/http';
import { Services } from "../../../services/gestionUser/models/services";
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss'
})
export class CreateServiceComponent implements OnInit {
  serviceForm: FormGroup;
  currentUserId: number | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Image handling properties
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  apiBaseUrl = API_BASE_URL;

  // Service categories from your enum
  serviceCategories = [
    'ACCOMMODATION', 'TRANSPORT', 'TOUR_GUIDE', 'ACTIVITY',
    'RESTAURANT', 'WELLNESS', 'ENTERTAINMENT', 'SHOPPING',
    'ADVENTURE', 'EVENT', 'SPORTS', 'CRUISE', 'CULTURE',
    'EQUIPMENT_RENTAL', 'TRAVEL_INSURANCE', 'OTHER'
  ];
  // Add service statuses array
  serviceStatuses = [
    'DISPONIBLE', 'INDISPONIBLE'
  ];

  constructor(
      private fb: FormBuilder,
      private serviceController: ServiceControllerService,
      private currentuserService: CurrentuserService,
      private router: Router,
      private http: HttpClient
  ) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: [''],
      status: ['DISPONIBLE', Validators.required] // Keep default but make it required
    });
  }
  get status() { return this.serviceForm.get('status'); }


  ngOnInit(): void {
    // Get current user ID for service creation
    this.currentuserService.getCurrentUserId().subscribe(id => {
      this.currentUserId = id;
    });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    if (!this.currentUserId) {
      this.errorMessage = 'You must be logged in to create a service';
      return;
    }

    this.isLoading = true;
    const serviceData: Services = this.serviceForm.value;

    // Use the createService endpoint which requires partnerId
    this.serviceController.createService({
      body: serviceData,
      partnerId: this.currentUserId
    }).subscribe(
        (result) => {
          // If a file has been selected, upload it after the service is created
          if (this.selectedFile && result.id) {
            this.uploadServiceImage(result.id);
          } else {
            this.isLoading = false;
            this.successMessage = 'Service created successfully!';
            this.serviceForm.reset({
              status: 'DISPONIBLE',
              price: 0
            });

            setTimeout(() => {
              this.router.navigate(['/front-office/myprofilepartner']);
            }, 2000);
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to create service. Please try again.';
        }
    );
  }

  // Upload service image after creation of service
  uploadServiceImage(serviceId: number): void {
    if (!this.selectedFile || !serviceId) {
      this.isLoading = false;
      this.successMessage = 'Service created successfully!';

      setTimeout(() => {
        this.router.navigate(['/front-office/myprofilepartner']);
      }, 2000);
      return;
    }

    // Create FormData object to send file
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Call API to upload service image
    const url = `${this.apiBaseUrl}/services/add/${serviceId}/image`;

    this.http.post<Services>(url, formData)
        .pipe(
            finalize(() => {
              this.isLoading = false;
              this.successMessage = 'Service created successfully with image!';

              // Navigate after a short delay to show success message
              setTimeout(() => {
                this.router.navigate(['/front-office/myprofilepartner']);
              }, 2000);
            })
        )
        .subscribe({
          next: (response) => {
            console.log('Service image uploaded successfully', response);
          },
          error: (error) => {
            console.error('Error uploading service image:', error);
            // Still navigate to services page since the service was created successfully
            this.errorMessage = 'Service created but image upload failed.';
          }
        });
  }

  // Method to handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle image errors
  handleImageError(): void {
    this.imageUrl = null;
  }

  // Form getters for validation
  get name() { return this.serviceForm.get('name'); }
  get description() { return this.serviceForm.get('description'); }
  get price() { return this.serviceForm.get('price'); }
  get category() { return this.serviceForm.get('category'); }

  navigateToServiceList(): void {
    console.log('Navigating back to service list');
    this.router.navigate(['/front-office/myprofilepartner']);
  }
  onCancel(): void {
    this.navigateToServiceList();
  }
}