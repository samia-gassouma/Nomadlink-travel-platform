import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {finalize, map} from 'rxjs/operators';
import { ServiceControllerService } from '../../../services/gestionUser/services/service-controller.service';
import { PartnerControllerService } from '../../../services/gestionUser/services/partner-controller.service';
import { Services } from '../../../services/gestionUser/models/services';
import { API_BASE_URL } from '../constants/api';
import {forkJoin, Observable} from "rxjs";

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  services: Services[] = [];
  filteredServices: Services[] = [];
  displayedServices: Services[] = [];
  isLoading = false;
  errorMessage = '';
  apiBaseUrl = API_BASE_URL;

  // Search and filter controls
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  selectedPartnershipStatus = '';

  // Service categories for filter
  serviceCategories = [
    'ACCOMMODATION', 'TRANSPORT', 'TOUR_GUIDE', 'ACTIVITY',
    'RESTAURANT', 'WELLNESS', 'ENTERTAINMENT', 'SHOPPING',
    'ADVENTURE', 'EVENT', 'SPORTS', 'CRUISE', 'CULTURE',
    'EQUIPMENT_RENTAL', 'TRAVEL_INSURANCE', 'OTHER'
  ];

  // Status options
  statusOptions = ['DISPONIBLE', 'INDISPONIBLE'];

  // Partnership status options
  partnershipStatusOptions = ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'TERMINATED'];

  // Sorting
  sortBy = 'none';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortOptions = [
    { value: 'none', label: 'No Sorting' },
    { value: 'name', label: 'Service Name' },
    { value: 'partnerName', label: 'Partner Name' },
    { value: 'price', label: 'Price' },
    { value: 'category', label: 'Category' },
    { value: 'users', label: 'Number of Users' } // Add this line

  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  userCounts: Record<number, number> = {};

  constructor(
      private router: Router,
      private serviceController: ServiceControllerService,
      private partnerService: PartnerControllerService
  ) { }

  ngOnInit(): void {
    this.loadAllServices();
  }

  loadAllServices(): void {
    this.isLoading = true;
    this.serviceController.getAllServices()
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe({
          next: (data) => {
            this.services = data;
            this.applyFilters();
            // Ajoutez ceci pour charger le nombre d'utilisateurs pour chaque service
            this.loadUserCounts();
            this.loadStatistics(); // Ajoutez cette ligne

          },
          error: (error) => {
            console.error('Error loading services:', error);
            this.errorMessage = 'Failed to load services';
          }
        });
  }

  applyFilters(): void {
    let result = [...this.services];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(service =>
          (service.name?.toLowerCase().includes(term) || false) ||
          (service.description?.toLowerCase().includes(term) || false) ||
          (service.partner?.firstname?.toLowerCase().includes(term) || false) ||
          (service.partner?.lastname?.toLowerCase().includes(term) || false)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      result = result.filter(service => service.category === this.selectedCategory);
    }

    // Apply service status filter
    if (this.selectedStatus) {
      result = result.filter(service => service.status === this.selectedStatus);
    }

    // Apply partnership status filter
    if (this.selectedPartnershipStatus) {
      result = result.filter(service => service.partner?.partnershipStatus === this.selectedPartnershipStatus);
    }

    // Apply sorting
    result = this.sortServices(result);

    this.filteredServices = result;
    this.totalPages = Math.ceil(this.filteredServices.length / this.itemsPerPage);
    this.updateDisplayedServices();
  }

  sortServices(services: Services[]): Services[] {
    if (this.sortBy === 'none') return services;

    return [...services].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = this.compareValues(a.name, b.name);
          break;
        case 'partnerName':
          const aName = `${a.partner?.firstname || ''} ${a.partner?.lastname || ''}`.trim();
          const bName = `${b.partner?.firstname || ''} ${b.partner?.lastname || ''}`.trim();
          comparison = this.compareValues(aName, bName);
          break;
        case 'price':
          comparison = this.compareValues(a.price, b.price);
          break;
        case 'category':
          comparison = this.compareValues(a.category, b.category);
          break;
        case 'users':
          // Use the userCounts object to compare user counts
          const aCount = a.id !== undefined ? (this.userCounts[a.id] || 0) : 0;
          const bCount = b.id !== undefined ? (this.userCounts[b.id] || 0) : 0;
          comparison = this.compareValues(aCount, bCount);
          break;
      }

      // Apply sort order
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  compareValues(a: any, b: any): number {
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return -1;
    if (b === undefined) return 1;

    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }

    return a - b;
  }

  updateDisplayedServices(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredServices.length);
    this.displayedServices = this.filteredServices.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedServices();
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
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
      }
    }
  }

  changeSortBy(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.toggleSortOrder();
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedPartnershipStatus = '';
    this.sortBy = 'none';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.applyFilters();
  }

  viewServiceDetails(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      return;
    }
    this.router.navigate(['/back-office/service-details', serviceId]);
  }

  viewPartnerDetails(partnerId: number | undefined): void {
    if (partnerId === undefined) {
      console.error('Partner ID not defined');
      return;
    }
    this.router.navigate(['/back-office/partner', partnerId]);
  }

  deleteService(serviceId: number | undefined): void {
    if (serviceId === undefined) {
      console.error('Service ID not defined');
      return;
    }

    if (confirm('Are you sure you want to delete this service?')) {
      this.isLoading = true;
      this.serviceController.deleteService({ id: serviceId })
          .pipe(finalize(() => {
            this.isLoading = false;
          }))
          .subscribe({
            next: () => {
              this.services = this.services.filter(service => service.id !== serviceId);
              this.applyFilters();
            },
            error: (error) => {
              console.error('Error deleting service:', error);
              this.errorMessage = 'Failed to delete service';
            }
          });
    }
  }

  getServiceImageUrl(imagePath: string | undefined): string | null {
    if (!imagePath) {
      return null;
    }
    return `${this.apiBaseUrl}/uploads/${imagePath}`;
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;

    if (parent.querySelector('.image-placeholder')) {
      parent.querySelector('.image-placeholder').style.display = 'flex';
    }
  }

  getIconForCategory(category?: string): string {
    if (!category) return 'fa-question';

    switch (category) {
      case 'ACCOMMODATION': return 'fa-hotel';
      case 'TRANSPORT': return 'fa-car';
      case 'TOUR_GUIDE': return 'fa-map';
      case 'ACTIVITY': return 'fa-hiking';
      case 'RESTAURANT': return 'fa-utensils';
      case 'WELLNESS': return 'fa-spa';
      case 'ENTERTAINMENT': return 'fa-ticket-alt';
      case 'SHOPPING': return 'fa-shopping-cart';
      case 'ADVENTURE': return 'fa-mountain';
      case 'EVENT': return 'fa-calendar-alt';
      case 'SPORTS': return 'fa-running';
      case 'CRUISE': return 'fa-ship';
      case 'CULTURE': return 'fa-landmark';
      case 'EQUIPMENT_RENTAL': return 'fa-tools';
      case 'TRAVEL_INSURANCE': return 'fa-umbrella';
      case 'OTHER':
      default: return 'fa-question';
    }
  }

  getPartnershipStatusClass(status?: string): string {
    if (!status) return 'status-unknown';

    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      case 'PENDING': return 'status-pending';
      case 'SUSPENDED': return 'status-suspended';
      case 'TERMINATED': return 'status-terminated';
      default: return 'status-unknown';
    }
  }

  protected readonly Math = Math;


  loadUserCounts(): void {
    this.services.forEach(service => {
      if (service.id !== undefined) {
        this.serviceController.getUserCountForService({ serviceId: service.id })
            .subscribe({
              next: (count) => {
                this.userCounts[service.id as number] = count;
              },
              error: (error) => {
                console.error(`Error loading user count for service ${service.id}:`, error);
                this.userCounts[service.id as number] = 0;
              }
            });
      }
    });
  }

  // Ajoutez ceci dans la classe ServicesListComponent
  statistics = {
    totalServices: 0,
    availableServices: 0,
    unavailableServices: 0,
    servicesByCategory: {} as Record<string, number>,
    mostChosenServices: [] as {name: string, count: number}[],
    mostChosenByCategory: {} as Record<string, any>
  };

  loadStatistics(): void {
    // Statistiques de base
    this.statistics.totalServices = this.services.length;
    this.statistics.availableServices = this.services.filter(s => s.status === 'DISPONIBLE').length;
    this.statistics.unavailableServices = this.services.filter(s => s.status === 'INDISPONIBLE').length;

    // Services par catégorie
    this.statistics.servicesByCategory = {};
    this.services.forEach(service => {
      if (service.category) {
        if (!this.statistics.servicesByCategory[service.category]) {
          this.statistics.servicesByCategory[service.category] = 0;
        }
        this.statistics.servicesByCategory[service.category]++;
      }
    });

    // Créer un tableau d'observables pour charger les statistiques d'utilisation
    const countObservables: Observable<{service: Services, count: number}>[] = [];

    // Pour chaque service, créer un observable qui récupère le nombre d'utilisateurs
    this.services.forEach(service => {
      if (service.id !== undefined) {
        const countObservable = this.serviceController.getUserCountForService({ serviceId: service.id })
            .pipe(
                map(count => ({ service: service, count: count || 0 }))
            );
        countObservables.push(countObservable);
      }
    });

    // Utiliser forkJoin pour attendre que tous les observables soient complétés
    if (countObservables.length > 0) {
      forkJoin(countObservables).subscribe({
        next: (results) => {
          // Trier par nombre d'utilisateurs (décroissant)
          results.sort((a, b) => b.count - a.count);

          // Récupérer les services les plus populaires
          this.statistics.mostChosenServices = results
              .slice(0, 5)
              .map(item => ({
                name: item.service.name || 'N/A',
                count: item.count
              }));

          // Grouper par catégorie pour les services les plus populaires par catégorie
          const categoryMap = {} as Record<string, any[]>;
          results.forEach(item => {
            const category = item.service.category;
            if (category) {
              if (!categoryMap[category]) {
                categoryMap[category] = [];
              }
              categoryMap[category].push({
                name: item.service.name || 'N/A',
                count: item.count
              });
            }
          });

          // Trouver le plus populaire dans chaque catégorie
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

}