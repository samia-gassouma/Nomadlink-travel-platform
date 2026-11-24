import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/front-office/services/activity.service';
import { Activity } from 'src/app/front-office/models/activity.model';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrl: './edit-activity.component.scss'
})
export class EditActivityComponent {
  activityForm!: FormGroup;
  activityId!: number;
  loading = false;
  errorMessage = '';
  activityTypes: string[] = ['Hiking', 'Swimming', 'Kayaking', 'Biking'];
languagesList: string[] = ['English', 'French', 'Spanish', 'German'];
accessibilityOptions: string[] = ['Wheelchair', 'Blind-friendly', 'Sign language'];
selectedImagePreview: string | ArrayBuffer | null = null;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.activityId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadActivity();
  }

  initForm(): void {
    this.activityForm = this.fb.group({
      activityName: [''],
      activityDescription: [''],
      activityType: [''],
      activityLocation: [''],
      priceType: [''],
      priceRange: [''],
      bookingRequired: [''],
      duration: [''],
      difficultyLevel: [''],
      requiredEquipment: [''],
      safetyTips: [''],
      accessibility: [[]],
      languages: [[]],
      galleryImages: [[]],
      mainImage: [null]
    });
  }

  loadActivity(): void {
    this.loading = true;
    this.activityService.getActivityById(this.activityId).subscribe({
      next: (activity: Activity) => {
        this.activityForm.patchValue(activity);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Could not load activity';
        console.error(err);
        this.loading = false;
      }
    });
  }
  isMainImageAFile(): boolean {
    return this.activityForm?.value?.mainImage instanceof File;
  }

  onCheckboxChange(event: any): void {
    const checked = event.checked;
    // Implémente ta logique ici
    console.log('Checkbox changed:', checked);
  }
  
  

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.activityForm.patchValue({ mainImage: file });
  
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  

  onSubmit(): void {
    const formData = new FormData();

    for (const key in this.activityForm.value) {
      if (key === 'mainImage' && this.activityForm.value[key]) {
        formData.append(key, this.activityForm.value[key]);
      } else if (Array.isArray(this.activityForm.value[key])) {
        this.activityForm.value[key].forEach((item: string) =>
          formData.append(key, item)
        );
      } else {
        formData.append(key, this.activityForm.value[key]);
      }
    }

    this.activityService.updateActivity(this.activityId, formData).subscribe({
      next: () => {
        alert('Activity updated successfully!');
        this.router.navigate(['/back-office/activities']);
      },
      error: (err) => {
        console.error('Error updating activity:', err);
        alert('Failed to update activity.');
      }
    });
  }


}
