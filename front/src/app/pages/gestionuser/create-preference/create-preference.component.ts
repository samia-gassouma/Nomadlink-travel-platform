import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PreferenceControllerService} from "../../../services/gestionUser/services/preference-controller.service";
import { Preference} from "../../../services/gestionUser/models/preference";

@Component({
  selector: 'app-create-preference',
  templateUrl: './create-preference.component.html',
  styleUrls: ['./create-preference.component.css']
})
export class CreatePreferenceComponent implements OnInit {
  preferenceForm!: FormGroup; // Added non-null assertion operator (!)
  submitted = false;
  error = '';
  loading = false;

  categories = [
    'DESTINATION', 'ACTIVITY', 'EVENT', 'FLIGHT', 'SERVICE',
    'ACCOMMODATION', 'TRANSPORT', 'GUIDE', 'CULTURE',
    'FAMILY', 'ACCESSIBILITY', 'TRAVEL_TYPE'
  ];

  constructor(
      private formBuilder: FormBuilder,
      private preferenceService: PreferenceControllerService,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.preferenceForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.preferenceForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.preferenceForm.invalid) {
      return;
    }

    this.loading = true;

    const newPreference: Preference = {
      name: this.f['name'].value,
      category: this.f['category'].value
    };

    this.preferenceService.addPreference({ body: newPreference })
        .subscribe({
          next: (response) => {
            this.loading = false;
            // Navigate to preference list or detail page
            this.router.navigate(['/back-office/preferences']);
          },
          error: (err) => {
            this.error = 'Failed to create preference. Please try again.';
            this.loading = false;
          }
        });
  }

  cancel(): void {
    this.router.navigate(['/back-office/preferences']);
  }
}
