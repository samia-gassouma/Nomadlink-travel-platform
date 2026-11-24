import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../front-office/services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Event } from '../../../front-office/models/evenement.model';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {
  eventForm!: FormGroup;
  id_event!: number;
  imageFile: File | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  imagePreview: string | null = null;
  imageUrl: string | null = null;



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'événement depuis l'URL
    this.id_event = Number(this.route.snapshot.paramMap.get('id'));
    // Initialiser le formulaire
    this.initForm();
    // Charger les détails de l'événement
    this.loadEventDetails(this.id_event);
  }

  initForm(): void {
    // Initialiser le formulaire avec les champs nécessaires
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      location: ['', Validators.required],
      language: ['', Validators.required],
      registrationFee: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],  // image sera géré séparément
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  loadEventDetails(eventId: number): void {
    this.eventService.getEventById(this.id_event).subscribe(
      (event: Event) => {
        console.log('Event data loaded:', event); // Debug: Check if data is loaded
  
        // Ensure that event data exists
        if (event) {
          // Format dates for datetime-local inputs
          const startDateTime = this.formatDateForInput(event.startDateTime);
          const endDateTime = this.formatDateForInput(event.endDateTime);
  
          // Patch the form with event data
          this.eventForm.patchValue({
            title: event.title,
            type: event.type,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            location: event.location,
            language: event.language,
            registrationFee: event.registrationFee.toString(), // Convert to string
            description: event.description,
          });
  
          // Check if there is an image and set the preview
          if (event.imageUrl) {
            this.imagePreview = event.imageUrl;
            this.imageUrl = event.imageUrl; // Store the original image URL in case the user doesn't change it
          }
        } else {
          console.error('No event data returned from the API');
          this.errorMessage = 'No event found with the given ID';
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading event:', error);
        this.errorMessage = 'Failed to load event. Please try again later.';
      }
    );
  }
  
  
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  }
  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }
  
    this.isLoading = true;
    const formData = new FormData();
  
    // Add all form values except image
    Object.keys(this.eventForm.controls).forEach(key => {
      if (key !== 'image') {
        const value = this.eventForm.get(key)?.value;
        formData.append(key, value);
      }
    });
  
    // Add image if changed
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }
  
    this.eventService.updateEvent(this.id_event, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/admin/events']);
        this.resetForm();  // Reset form after successful update
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to update event';
      }
    });
  }
  
  // Reset the form after successful submission
  private resetForm(): void {
    this.eventForm.reset();
    this.imagePreview = null;
    this.imageFile = null;
    this.errorMessage = null;
  }
}  