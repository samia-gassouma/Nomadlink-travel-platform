import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DestinationService } from 'src/app/front-office/services/DestinationService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent {
  activityForm: FormGroup;
  selectedImage: File | null = null;
  selectedImagePreview: any;
  destinations: any[] = [];

  activityTypes: string[] = [
    'Adventure', 'Cultural', 'Nature', 'Sports', 'Food & Drink',
    'Relaxation', 'Educational', 'Nightlife', 'Shopping',
    'Water Sports', 'Winter Sports', 'Wildlife'
  ];

  accessibilityOptions: string[] = [
    'Wheelchair Accessible', 'Visual Assistance',
    'Hearing Assistance', 'Senior Friendly', 'Family Friendly'
  ];

  languagesList: string[] = [
    'English', 'French', 'Portuguese', 'Chinese',
    'Russian', 'Japanese', 'Hindi'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private destinationService: DestinationService
  ) {
    this.activityForm = this.fb.group({
      destinationId: ['', Validators.required],
      activityName: ['', Validators.required],
      activityDescription: [''],
      activityType: [''],
      activityLocation: [''],
      priceType: ['Paid'],
      priceRange: [''],
      bookingRequired: ['Yes'],
      duration: [''],
      difficultyLevel: ['Easy'],
      requiredEquipment: [''],
      safetyTips: [''],
      accessibility: [[]],
      languages: [[]],
      galleryImages: [''],
      mainImage: [null]
    });

    this.loadDestinations();
  }

  loadDestinations() {
    this.destinationService.getAllDestinations().subscribe({
      next: (data) => this.destinations = data,
      error: (err) => console.error('Erreur lors du chargement des destinations:', err)
    });
  }

  onCheckboxChange(event: any, field: string) {
    const formArray = this.activityForm.get(field)?.value || [];
    if (event.target.checked) {
      formArray.push(event.target.value);
    } else {
      const index = formArray.indexOf(event.target.value);
      if (index >= 0) {
        formArray.splice(index, 1);
      }
    }
    this.activityForm.get(field)?.setValue(formArray);
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.activityForm.value).forEach(key => {
      const value = this.activityForm.get(key)?.value;
      if (Array.isArray(value)) {
        value.forEach((v: string) => formData.append(key, v));
      } else if (value) {
        formData.append(key, value);
      }
    });

    if (this.selectedImage) {
      formData.append('mainImage', this.selectedImage);
    }

    this.http.post('http://localhost:9000/picloud/api/activities', formData).subscribe({
      next: (res) => {
        console.log('Activity created!', res);
        alert('Activity created successfully!');
        this.activityForm.reset();
        this.selectedImage = null;
        this.selectedImagePreview = null;
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Something went wrong. Please try again.');
      }
    });
  }
}
