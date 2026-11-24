import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray , FormControl } from '@angular/forms';
import { DestinationService } from 'src/app/front-office/services/DestinationService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-editdestination',
 
  templateUrl: './editdestination.component.html',
  styleUrl: './editdestination.component.scss'
})
export class EditdestinationComponent {
  destinationForm!: FormGroup;
  destinationId!: number;
  loading = false;
  errorMessage = '';
  mapLoaded = false;
  safeMapUrl!: SafeResourceUrl;
  mainImagePreview: string | ArrayBuffer | null = null;
  selectedMainImage!: File;
  galleryImagesFiles: File[] = [];
  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  selectedBestTimes: string[] = [];
  detailsVisible = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private destinationService: DestinationService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.destinationId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.fetchDestination();
  }

  initForm(): void {
    this.destinationForm = this.fb.group({
      name: [''],
      country: [''],
      type: [''],
      description: [''],
      language: [''],
      currency: [''],
      climate: [''],
      visaRequired: [false],
      safetyTips: [''],
      mapUrl: [''],
      mainImage: [null],
      bestTimeToVisit: [[]],
      galleryImages: this.fb.array([]),
    });
  }

  get galleryImages(): FormArray {
    return this.destinationForm.get('galleryImages') as FormArray;
  }

  fetchDestination(): void {
    this.loading = true;
    this.destinationService.getDestinationById(this.destinationId).subscribe({
      next: (destination) => {
        this.destinationForm.patchValue({
          name: destination.name,
          country: destination.country,
          type: destination.type,
          description: destination.description,
          language: destination.language,
          currency: destination.currency,
          climate: destination.climate,
          visaRequired: destination.visaRequired,
          safetyTips: destination.safetyTips,
          mapUrl: destination.mapUrl || '',
          bestTimeToVisit: destination.bestTime || [],
        });

        this.selectedBestTimes = destination.bestTime || [];

        if (destination.mapUrl) {
          this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(destination.mapUrl);
          this.mapLoaded = true;
        }

        if (destination.mainImageUrl) {
          this.mainImagePreview = 'http://localhost:9000/picloud/api/activities/images' + destination.mainImageUrl;
        }

        if (destination.galleryImages) {
          destination.galleryImages.forEach(() => {
            this.galleryImages.push(this.fb.control(null));
          });
        }

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement de la destination';
        this.loading = false;
      }
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedMainImage = file;
      this.destinationForm.patchValue({ mainImage: file });

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result !== undefined) {
          this.mainImagePreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onBestTimeChange(event: any): void {
    const value = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      this.selectedBestTimes.push(value);
    } else {
      this.selectedBestTimes = this.selectedBestTimes.filter((m) => m !== value);
    }

    this.destinationForm.patchValue({ bestTimeToVisit: this.selectedBestTimes });
  }

  onGalleryImageChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.galleryImagesFiles[index] = file;
    }
  }

  addGalleryImage(): void {
    this.galleryImages.push(new FormControl(null));
  }

  removeGalleryImage(index: number): void {
    this.galleryImages.removeAt(index);
    this.galleryImagesFiles.splice(index, 1);
  }

  toggleDetails(): void {
    this.detailsVisible = !this.detailsVisible;
  }

  onSubmit(): void {
    const formData = new FormData();

    const formValue = this.destinationForm.value;

    Object.entries(formValue).forEach(([key, value]) => {
      if (key === 'galleryImages') return;

      if (key === 'mainImage' && this.selectedMainImage) {
        formData.append('mainImage', this.selectedMainImage, this.selectedMainImage.name);
      } else if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'string' || typeof value === 'boolean') {
        formData.append(key, value.toString());
      }
    });

    this.galleryImagesFiles.forEach((file, index) => {
      if (file) {
        formData.append(`galleryImage${index}`, file, file.name);
      }
    });

    this.destinationService.updateDestinationFormData(this.destinationId, formData).subscribe({
      next: () => this.router.navigate(['/back-office/destinations']),
      error: () => this.errorMessage = 'Erreur lors de la mise à jour'
    });
  }
}