import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from 'src/app/front-office/services/event.service';
import { Event } from 'src/app/front-office/models/evenement.model';
import { DomSanitizer} from '@angular/platform-browser';
import { environment } from 'src/environments/environment'; // Assurez-vous que vous avez votre clé API ici.

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.scss']
})
export class AddeventComponent implements OnInit {

  eventForm!: FormGroup;
  eventId: number | null = null;
  imageFile: File | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  locationValue: string = ''; // Store the location value for map integration
  safeMapUrl: any; // Safe URL for Google Maps iframe
  mapLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      location: ['', Validators.required],
      duration: [''],
      language: [''],
      schedule: [''],
      description: [''],
      registrationFee: [''],
      image: [null]
    });

    // Subscribe to location changes and update the map
    this.eventForm.get('location')?.valueChanges.subscribe((location: string) => {
      this.locationValue = location;
      this.loadMapWithLocation(location);
    });

    if (this.eventId) {
      this.loadEventDetails(this.eventId);
    }
  }

  loadMapWithLocation(location: string): void {
    // Check if location is available and generate map URL
    if (location) {
      const query = encodeURIComponent(location);
      const url = `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=${query}`;

      // Sanitize the URL for use in the template
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.mapLoaded = true;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;

    this.isLoading = true;
    const formData = new FormData();

    // Append the form data to the FormData object
    Object.keys(this.eventForm.controls).forEach((key) => {
      formData.append(key, this.eventForm.get(key)?.value);
    });

    // Append the image if available
    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    }

    // Handle event update or add
    if (this.eventId) {
      this.eventService.updateEvent(this.eventId, formData).subscribe(
        (response: Event) => {
          this.isLoading = false;
          this.router.navigate(['/back-office/events']);
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.message;
        }
      );
    } else {
      this.eventService.addEvent(formData).subscribe(
        (response: Event) => {
          this.isLoading = false;
          this.router.navigate(['/back-office/events']);
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.message;
        }
      );
    }
  }


  loadEventDetails(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe(
      (event: Event) => {
        this.eventForm.patchValue(event);
        // Ensure map is loaded for the location if event has a location
        if (event.location) {
          this.loadMapWithLocation(event.location);
        }
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Failed to load event details';
      }
    );
  }
}

