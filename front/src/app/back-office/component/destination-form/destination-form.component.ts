import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-destination-form',
  templateUrl: './destination-form.component.html',
  styleUrls: ['./destination-form.component.scss']
})
export class DestinationFormComponent implements OnInit {
  destinationForm!: FormGroup;

  mainImageFile: File | null = null;
  mainImagePreview: string | ArrayBuffer | null = null;
  galleryImages: FormArray = this.fb.array([]); // Utilisation d'un FormArray générique pour éviter les erreurs de type
  galleryImageFiles: File[] = [];

locationValue: string = '';

  safeMapUrl: SafeResourceUrl | null = null;
  mapLoaded = false;
  detailsVisible = false;

  months: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  selectedBestTimes: string[] = [];

  constructor(
    private fb: FormBuilder,
    public sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.destinationForm = this.fb.group({
      name: ['', Validators.required],
      country: [''],
      type: [''],
      description: [''],
      language: [''],
      currency: [''],
      climate: [''],
      visaRequired: ['false'],
      safetyTips: [''],
      mapUrl: [''],
      galleryImages: this.fb.array([])  // Initialisation explicite du FormArray
    });
    this.destinationForm.get('name')?.valueChanges.subscribe((location: string) => {
      this.locationValue = location;
      this.loadMapWithLocation(location);
    });
    
  }
  loadMapWithLocation(location: string): void {
    if (location) {
      const query = encodeURIComponent(location);
      const url = `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=${query}`;
  
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.mapLoaded = true;
    }
  }
  

  toggleDetails(): void {
    this.detailsVisible = !this.detailsVisible;
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    this.mainImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.mainImagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onBestTimeChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedBestTimes.push(value);
    } else {
      this.selectedBestTimes = this.selectedBestTimes.filter(month => month !== value);
    }
  }

  // Ajoute une image à la galerie (FormArray)
  addGalleryImage(): void {
    this.galleryImages.push(this.fb.control<File | null>(null));  // Spécification du type lors de l'ajout du FormControl
  }

  // Gère le changement de l'image de la galerie pour un index donné
  onGalleryImageChange(event: any, index: number): void {
    const file = event.target.files[0];
    this.galleryImages.at(index).setValue(file);
  }

  // Supprime une image de la galerie
  removeGalleryImage(index: number): void {
    this.galleryImages.removeAt(index);
  }

  onMainImageSelected(event: any): void {
    this.mainImageFile = event.target.files[0];
  }

  onGalleryImagesSelected(event: any): void {
    this.galleryImageFiles = Array.from(event.target.files);
  }

  onSubmit(): void {
    const formData = new FormData();
    const formValues = this.destinationForm.value;

    Object.keys(formValues).forEach(key => {
      formData.append(key, formValues[key]);
    });

    if (this.mainImageFile) {
      formData.append('mainImage', this.mainImageFile);
    }

    this.selectedBestTimes.forEach(month => {
      formData.append('bestTimeToVisit', month);
    });

    this.galleryImages.controls.forEach(control => {
      if (control.value) {
        formData.append('galleryImages', control.value);
      }
    });

    // Chargement sécurisé de la carte
    if (formValues.mapUrl) {
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(formValues.mapUrl);
      this.mapLoaded = true;
    }

    this.http.post('http://localhost:9000/picloud/api/destinations', formData).subscribe({
      next: () => alert('Destination créée avec succès !'),
      error: err => {
        console.error('Erreur lors de la création :', err);
        alert('Erreur lors de la création de la destination.');
      }
    });
  }
}
