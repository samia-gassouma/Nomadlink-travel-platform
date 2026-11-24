import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Preference } from '../../../services/gestionUser/models/preference';
import { PreferenceControllerService } from '../../../services/gestionUser/services/preference-controller.service';

@Component({
  selector: 'app-update-preference',
  templateUrl: './update-preference.component.html',
  styleUrls: ['./update-preference.component.css']
})
export class UpdatePreferenceComponent implements OnInit {
  preferenceForm: FormGroup;
  preferenceId: number | undefined;
  isLoading = true;
  submitted = false;
  errorMessage = '';

  categories = [
    'DESTINATION', 'ACTIVITY', 'EVENT', 'FLIGHT', 'SERVICE',
    'ACCOMMODATION', 'TRANSPORT', 'GUIDE', 'CULTURE',
    'FAMILY', 'ACCESSIBILITY', 'TRAVEL_TYPE'
  ];

  constructor(
      private fb: FormBuilder,
      private preferenceService: PreferenceControllerService,
      private route: ActivatedRoute,
      private router: Router
  ) {
    this.preferenceForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.preferenceId = +params['id'];
      this.loadPreference(this.preferenceId);
    });
  }

  loadPreference(id: number): void {
    this.isLoading = true;
    this.preferenceService.getPreferenceById({ id }).subscribe({
      next: (preference) => {
        this.preferenceForm.patchValue({
          name: preference.name,
          category: preference.category
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading preference:', error);
        this.errorMessage = 'Failed to load preference details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.preferenceForm.invalid) {
      return;
    }

    const updatedPreference: Preference = {
      id: this.preferenceId,
      name: this.preferenceForm.value.name,
      category: this.preferenceForm.value.category
    };

    this.isLoading = true;
    this.preferenceService.updatePreference({
      id: this.preferenceId as number,
      body: updatedPreference
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/back-office/preferences']);
      },
      error: (error) => {
        console.error('Error updating preference:', error);
        this.errorMessage = 'Failed to update preference.';
        this.isLoading = false;
      }
    });
  }

  getCategoryDisplay(category: string): string {
    return category.replace('_', ' ');
  }

  onCancel(): void {
    this.router.navigate(['/back-office/preferences']);
  }
}
