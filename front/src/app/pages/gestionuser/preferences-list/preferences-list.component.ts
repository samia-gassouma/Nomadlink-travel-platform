import { Component } from '@angular/core';
import {Preference} from "../../../services/gestionUser/models/preference";
import {PreferenceControllerService} from "../../../services/gestionUser/services/preference-controller.service";
import {Router} from "@angular/router";
import {forkJoin, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-preferences-list',
  templateUrl: './preferences-list.component.html',
  styleUrls: ['./preferences-list.component.scss']
})
export class PreferencesListComponent {
  preferences: Preference[] = [];
  filteredPreferences: Preference[] = []; // Pour stocker les préférences filtrées
  displayedPreferences: Preference[] = []; // Pour stocker les préférences affichées sur la page actuelle
  isLoading = true;
  searchTerm = ''; // Pour la recherche par nom
  selectedCategory = ''; // Pour le filtrage par catégorie
  categories: string[] = []; // Pour stocker les catégories disponibles
  sortOrder = 'newest'; // 'newest' (default), 'latest' or 'mostUsers'

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
      private preferenceService: PreferenceControllerService,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.isLoading = true;
    this.preferenceService.getAllPreferences().subscribe({
      next: (data) => {
        this.preferences = data;
        this.applyFiltersAndSort(); // Appliquer le filtrage et le tri
        this.extractCategories(); // Extraire les catégories uniques
        this.loadStatistics(); // Charger les statistiques
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading preferences:', error);
        this.isLoading = false;
      }
    });
  }

  // Extraire les catégories uniques pour le filtre
  extractCategories(): void {
    const uniqueCategories = new Set<string>();
    this.preferences.forEach(pref => {
      if (pref.category) {
        uniqueCategories.add(pref.category);
      }
    });
    this.categories = Array.from(uniqueCategories).sort();
  }

  // Méthode pour filtrer les préférences
  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters change
    this.applyFiltersAndSort(); // Utilise la nouvelle fonction combinée
  }

  // Méthode pour appliquer le filtrage et le tri
  applyFiltersAndSort(): void {
    // D'abord, filtrer les préférences
    let filtered = this.preferences.filter(pref => {
      // Filtre par nom (recherche insensible à la casse)
      const nameMatch = !this.searchTerm ||
          (pref.name && pref.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      // Filtre par catégorie
      const categoryMatch = !this.selectedCategory || pref.category === this.selectedCategory;

      return nameMatch && categoryMatch;
    });

    // Ensuite, trier les préférences filtrées
    filtered = this.sortPreferences(filtered);

    this.filteredPreferences = filtered;
    this.totalPages = Math.ceil(this.filteredPreferences.length / this.itemsPerPage);
    this.updateDisplayedPreferences();
  }

  // Update displayed preferences based on current page
  updateDisplayedPreferences(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredPreferences.length);
    this.displayedPreferences = this.filteredPreferences.slice(startIndex, endIndex);
  }

  // Pagination methods
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedPreferences();
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  prevPage(): void {
    this.changePage(this.currentPage - 1);
  }

  getPageArray(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      // If less than 5 pages, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Otherwise, show 5 pages centered around current page
      if (currentPage <= 3) {
        // First pages
        return [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        // Last pages
        return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Middle pages
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
      }
    }
  }

  // Méthode pour trier les préférences
  sortPreferences(prefsToSort: Preference[]): Preference[] {
    return [...prefsToSort].sort((a, b) => {
      // Utiliser l'ID comme indicateur chronologique
      if (!a.id || !b.id) return 0;

      if (this.sortOrder === 'newest') {
        // Plus récents d'abord (IDs plus élevés)
        return b.id - a.id;
      } else if (this.sortOrder === 'latest') {
        // Plus anciens d'abord (IDs plus petits)
        return a.id - b.id;
      } else if (this.sortOrder === 'mostUsers') {
        // Sort by user count (most users first)
        const countA = a.id ? (this.userCountMap.get(a.id) || 0) : 0;
        const countB = b.id ? (this.userCountMap.get(b.id) || 0) : 0;
        return countB - countA;
      } else {
        return b.id - a.id; // Default to newest
      }
    });
  }

  // Méthode pour changer l'ordre de tri
  changeSortOrder(order: 'newest' | 'latest' | 'mostUsers'): void {
    if (this.sortOrder !== order) {
      this.sortOrder = order;
      this.applyFiltersAndSort();
    }
  }

  // Méthode pour réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.sortOrder = 'newest'; // Reset to default sort order
    this.currentPage = 1; // Reset to first page
    this.applyFiltersAndSort();
  }

  // Méthode pour naviguer vers la page de création
  navigateToCreate(): void {
    this.router.navigate(['/back-office/createpreference']);
  }

  onViewDetails(id: number | undefined): void {
    if (id !== undefined) {
      // Navigate to preference details page
      this.router.navigate(['/back-office/preferences', id]);
    }
  }

  onEdit(id: number | undefined): void {
    if (id !== undefined) {
      // Navigate to preference edit page
      this.router.navigate(['/back-office/preferences/edit', id]);
    }
  }

  onDelete(id: number | undefined): void {
    if (id !== undefined && confirm('Are you sure you want to delete this preference?')) {
      this.preferenceService.deletePreference({ id }).subscribe({
        next: () => {
          this.loadPreferences(); // Reload the list after deletion
        },
        error: (error) => {
          console.error('Error deleting preference:', error);
        }
      });
    }
  }

  // Helper method to get readable category name
  getCategoryDisplay(category: string | undefined): string {
    if (!category) return 'N/A';
    return category.replace('_', ' ');
  }

  // Helper method to get safe lowercase category for CSS classes
  getSafeCategoryClass(category: string | undefined): string {
    if (!category) return '';
    return 'category-' + category.toLowerCase();
  }

  // For pagination display
  protected readonly Math = Math;

  //stats
  // Ajoutez ces propriétés à votre classe
  statistics = {
    totalPreferences: 0,
    mostChosenPreferences: [] as {name: string, count: number}[],
    mostChosenByCategory: {} as Record<string, any>
  };

  loadStatistics(): void {
    this.statistics.totalPreferences = this.preferences.length;
    this.userCountMap.clear(); // Réinitialiser la carte


    // Create an array to track all observables
    const countObservables: Observable<{preference: Preference, count: number}>[] = [];

    // For each preference, create an observable that emits the preference with its user count
    this.preferences.forEach(pref => {
      if (pref.id) {
        const countObservable = this.preferenceService.countUsersByPreference({ preferenceId: pref.id })
            .pipe(
                map(count => ({ preference: pref, count: count || 0 }))
            );
        countObservables.push(countObservable);
      }
    });

    // Use forkJoin to wait for all observables to complete
    if (countObservables.length > 0) {
      forkJoin(countObservables).subscribe({
        next: (results) => {
          results.forEach(item => {
            if (item.preference.id) {
              this.userCountMap.set(item.preference.id, item.count);
            }
          });
          // Sort by count (descending)
          results.sort((a, b) => b.count - a.count);

          // Get most chosen preferences
          this.statistics.mostChosenPreferences = results
              .slice(0, 5)
              .map(item => ({
                name: item.preference.name || 'N/A',
                count: item.count
              }));

          // Group by category for most chosen in each category
          const categoryMap = {} as Record<string, any[]>;
          results.forEach(item => {
            const category = item.preference.category;
            if (category) {
              if (!categoryMap[category]) {
                categoryMap[category] = [];
              }
              categoryMap[category].push({
                name: item.preference.name || 'N/A',
                count: item.count
              });
            }
          });

          // Find most popular in each category
          for (const category in categoryMap) {
            categoryMap[category].sort((a, b) => b.count - a.count);
            this.statistics.mostChosenByCategory[category] = categoryMap[category][0];
          }
        },
        error: (error) => {
          console.error('Error loading statistics:', error);
        }
      });
    }

  }
  // Ajouter un map pour garder en cache le nombre d'utilisateurs par préférence
  userCountMap: Map<number, number> = new Map();

// Méthode pour obtenir le nombre d'utilisateurs pour une préférence
  getUserCount(preferenceId: number | undefined): number | string {
    if (!preferenceId) return 'N/A';

    // Vérifier si nous avons déjà le compte en cache
    if (this.userCountMap.has(preferenceId)) {
      return this.userCountMap.get(preferenceId) || 0;
    }

    // Si pas en cache, retourner un placeholder en attendant le chargement
    return '-';
  }

}