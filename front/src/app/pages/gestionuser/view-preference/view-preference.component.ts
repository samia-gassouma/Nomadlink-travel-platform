import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preference } from '../../../services/gestionUser/models/preference';
import { PreferenceControllerService } from '../../../services/gestionUser/services/preference-controller.service';

@Component({
  selector: 'app-view-preference',
  templateUrl: './view-preference.component.html',
  styleUrls: ['./view-preference.component.css']
})
export class ViewPreferenceComponent implements OnInit {
  preference: Preference | null = null;
  preferenceId: number | undefined;
  isLoading = true;
  errorMessage = '';

  constructor(
      private preferenceService: PreferenceControllerService,
      private route: ActivatedRoute,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.preferenceId = +params['id'];
      this.loadPreference(this.preferenceId);
    });
  }

  loadPreference(id: number): void {
    this.isLoading = true;
    this.preferenceService.getPreferenceById({ id }).subscribe({
      next: (data) => {
        this.preference = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading preference:', error);
        this.errorMessage = 'Failed to load preference details.';
        this.isLoading = false;
      }
    });
  }

  getCategoryDisplay(category: string | undefined): string {
    if (!category) return 'N/A';
    return category.replace('_', ' ');
  }

  getSafeCategoryClass(category: string | undefined): string {
    if (!category) return '';
    return 'category-' + category.toLowerCase();
  }

  onBack(): void {
    this.router.navigate(['/back-office/preferences']);
  }

  onEdit(): void {
    if (this.preferenceId !== undefined) {
      this.router.navigate(['/back-office/preferences/edit', this.preferenceId]);
    }
  }
}
