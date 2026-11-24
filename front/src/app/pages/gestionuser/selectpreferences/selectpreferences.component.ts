import { Component, OnInit } from '@angular/core';
import { PreferenceControllerService } from "../../../services/gestionUser/services/preference-controller.service";
import { Preference } from "../../../services/gestionUser/models/preference";
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-selectpreferences',
  templateUrl: './selectpreferences.component.html',
  styleUrls: ['./selectpreferences.component.scss']
})
export class SelectpreferencesComponent implements OnInit {
  preferences: any[] = [];
  selectedPreferences: Set<number> = new Set();
  currentCategoryIndex: number = 0;
  categories: string[] = [
    'DESTINATION', 'ACTIVITY', 'EVENT',
    'FLIGHT', 'SERVICE', 'ACCOMMODATION',
    'TRANSPORT', 'GUIDE', 'CULTURE',
    'FAMILY', 'ACCESSIBILITY', 'TRAVEL_TYPE'
  ];

  // Engaging questions for each category
  categoryQuestions: { [key: string]: string } = {
    'DESTINATION': 'Which destinations inspire your wanderlust?',
    'ACTIVITY': 'What activities make your travel experience unforgettable?',
    'EVENT': 'Which types of events would you love to attend during your travels?',
    'FLIGHT': 'How do you prefer to fly to your destinations?',
    'SERVICE': 'Which travel services enhance your journey?',
    'ACCOMMODATION': 'Where do you feel most at home when traveling?',
    'TRANSPORT': 'How do you like to get around once you have arrived?',
        'GUIDE': 'What kind of guidance helps you discover new places?',
  'CULTURE': 'Which cultural experiences do you seek when traveling?',
  'FAMILY': 'What makes travel special for you and your loved ones?',
  'ACCESSIBILITY': 'Which accessibility options are important for your comfort?',
  'TRAVEL_TYPE': 'What is your preferred travel style?'
};

categoryIcons: { [key: string]: string } = {
  'DESTINATION': 'fa-map-marker-alt',
  'ACTIVITY': 'fa-hiking',
  'EVENT': 'fa-calendar-alt',
  'FLIGHT': 'fa-plane',
  'SERVICE': 'fa-concierge-bell',
  'ACCOMMODATION': 'fa-hotel',
  'TRANSPORT': 'fa-car',
  'GUIDE': 'fa-compass',
  'CULTURE': 'fa-landmark',
  'FAMILY': 'fa-users',
  'ACCESSIBILITY': 'fa-wheelchair',
  'TRAVEL_TYPE': 'fa-suitcase'
};

selectedCategoryPreferences: any[] = [];
userId: number | null = null;
loading: boolean = true;
savingPreferences: boolean = false;
saveSuccess: boolean = false;

// To track the selection status of each category
selectedCategories: Set<string> = new Set();
progressPercentage: number = 0;

constructor(
    private preferenceService: PreferenceControllerService,
    private currentuserService: CurrentuserService,
    private router: Router
) {}

ngOnInit(): void {
  this.currentuserService.loadCurrentUser();
  this.currentuserService.getCurrentUserId().subscribe(id => {
    this.userId = id;
    this.loadPreferences();
  });
}

loadPreferences(): void {
  this.loading = true;
  this.preferenceService.getAllPreferences().subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.preferences = response;
          this.updateCategoryPreferences();
        } else {
          console.error('The response is not an array', response);
        }
        this.loading = false;
        this.updateProgress();
      },
      (error) => {
        console.error('Error fetching preferences', error);
        this.loading = false;
      }
  );
}

updateCategoryPreferences(): void {
  const categoriesToShow = this.categories.slice(this.currentCategoryIndex, this.currentCategoryIndex + 3);
  this.selectedCategoryPreferences = [];

  categoriesToShow.forEach(category => {
    const categoryPreferences = this.preferences.filter(pref => pref.category === category);
    this.selectedCategoryPreferences.push({
      category: category,
      preferences: categoryPreferences
    });
  });
}

nextCategory(): void {
  if (this.currentCategoryIndex + 3 < this.categories.length) {
  this.currentCategoryIndex += 3;
  this.updateCategoryPreferences();
  this.updateProgress();
  window.scrollTo(0, 0);
}
}

toggleSelection(preferenceId: number, category: string): void {
  if (this.selectedPreferences.has(preferenceId)) {
  this.selectedPreferences.delete(preferenceId);
} else {
  this.selectedPreferences.add(preferenceId);
}

// Update category selection status
const hasSelectionInCategory = this.preferences
    .filter(pref => pref.category === category)
    .some(pref => this.selectedPreferences.has(pref.id));

if (hasSelectionInCategory) {
  this.selectedCategories.add(category);
} else {
  this.selectedCategories.delete(category);
}

this.updateProgress();
}

isSelected(preferenceId: number): boolean {
  return this.selectedPreferences.has(preferenceId);
}

isLastCategory(): boolean {
  return this.currentCategoryIndex + 3 >= this.categories.length;
}

canMoveNext(): boolean {
  if (this.isLastCategory()) {
    return false;
  }

  // Check if all current categories have at least one selection
  const currentCategories = this.categories.slice(this.currentCategoryIndex, this.currentCategoryIndex + 3);
  return currentCategories.every(category => this.selectedCategories.has(category));
}

canSavePreferences(): boolean {
  // If we're on the last page, check if all currently displayed categories have at least one selection
  if (this.isLastCategory()) {
    const currentCategories = this.categories.slice(this.currentCategoryIndex);
    return currentCategories.every(category => this.selectedCategories.has(category));
  }
  return false;
}

onAddPreferencesToUser(): void {
  if (this.userId === null) {
  console.error("User hasn't been loaded yet.");
  return;
}

// Double-check that we have at least one selection from each current category
if (!this.canSavePreferences()) {
  return;
}

this.savingPreferences = true;
const preferenceIds = Array.from(this.selectedPreferences);

this.preferenceService.addMultiplePreferencesToUser({
  userId: this.userId,
  body: preferenceIds
}).subscribe(
    (response) => {
      console.log('Preferences added successfully:', response);
      this.savingPreferences = false;
      this.saveSuccess = true;

      // Navigate after brief delay to show success message
      setTimeout(() => {
        this.router.navigate(['/home-v1']);
      }, 2000);
    },
    (error) => {
      console.error('Error adding preferences:', error);
      this.savingPreferences = false;
    }
);
}

previousCategory(): void {
  if (this.currentCategoryIndex - 3 >= 0) {
  this.currentCategoryIndex -= 3;
  this.updateCategoryPreferences();
  this.updateProgress();
  window.scrollTo(0, 0);
}
}

updateProgress(): void {
  const totalCategories = this.categories.length;
  const selectedCount = this.selectedCategories.size;
  this.progressPercentage = Math.round((selectedCount / totalCategories) * 100);
}

getFormattedCategoryName(category: string): string {
  return category.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

getCategoryIcon(category: string): string {
  return this.categoryIcons[category] || 'fa-tag';
}
}