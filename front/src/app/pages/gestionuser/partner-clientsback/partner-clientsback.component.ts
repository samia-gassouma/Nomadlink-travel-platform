import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { PartnerControllerService } from "../../../services/gestionUser/services/partner-controller.service";
import { User } from "../../../services/gestionUser/models/user";
import { Partner } from "../../../services/gestionUser/models/partner";
import { API_BASE_URL } from "../constants/api";
@Component({
  selector: 'app-partner-clientsback',
  templateUrl: './partner-clientsback.component.html',
  styleUrl: './partner-clientsback.component.scss'
})
export class PartnerClientsbackComponent implements OnInit {
  clients: User[] = [];
  filteredClients: User[] = [];
  displayedClients: User[] = [];
  partner: Partner | null = null;
  partnerId: number | null = null;
  isLoading = false;
  errorMessage = '';
  apiBaseUrl = API_BASE_URL;

  // Pour la recherche
  searchTerm = '';

  // Pour le tri
  sortBy = 'none';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Pour la pagination
  itemsPerPage = 10;
  currentPage = 1;

  // Options de tri
  sortOptions = [
    { value: 'none', label: 'No Sorting' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'email', label: 'Email (A-Z)' }
  ];

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private serviceController: ServiceControllerService,
      private partnerService: PartnerControllerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam && !isNaN(+idParam)) {
        this.partnerId = +idParam;
        this.loadPartnerDetails();
        this.loadPartnerClients();
      } else {
        this.errorMessage = 'Invalid partner ID';
      }
    });
  }

  loadPartnerDetails(): void {
    if (!this.partnerId) return;

    this.isLoading = true;
    this.partnerService.getPartnerById({ id: this.partnerId })
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe({
          next: (data) => {
            this.partner = data;
          },
          error: (error) => {
            console.error('Error loading partner details:', error);
            this.errorMessage = 'Failed to load partner details';
          }
        });
  }

  loadPartnerClients(): void {
    if (!this.partnerId) return;

    this.isLoading = true;
    this.serviceController.getClientsOfPartner({ partnerId: this.partnerId })
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe({
          next: (data) => {
            this.clients = data;
            this.applyFilters();
            console.log('Clients loaded:', this.clients);
          },
          error: (error) => {
            console.error('Error loading partner clients:', error);
            this.errorMessage = 'Failed to load partner clients';
          }
        });
  }

  get filteredClientsList(): User[] {
    let result = this.clients.filter(client => {
      // Filtrer par terme de recherche
      const matchesSearch = !this.searchTerm ||
          client.firstname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          client.lastname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          client.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          client.phoneNumber?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Appliquer le tri
    result = this.sortClients(result);

    return result;
  }

  // Trier les clients selon le critère sélectionné
  sortClients(clients: User[]): User[] {
    if (this.sortBy === 'none') return clients;

    return [...clients].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = this.compareValues(a.firstname, b.firstname) ||
              this.compareValues(a.lastname, b.lastname);
          break;
        case 'email':
          comparison = this.compareValues(a.email, b.email);
          break;
      }

      // Appliquer l'ordre de tri (asc/desc)
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // Fonction auxiliaire pour comparer les valeurs en toute sécurité
  compareValues(a: any, b: any): number {
    if (a === undefined && b === undefined) return 0;
    if (a === undefined) return -1;
    if (b === undefined) return 1;

    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }

    return a - b;
  }

  // Basculer l'ordre de tri en cliquant sur la même option de tri
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  // Changer le critère de tri
  changeSortBy(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.toggleSortOrder();
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'none';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Pagination
  pageChanged(page: number): void {
    this.currentPage = page;
    this.updateDisplayedClients();
  }

  applyFilters(): void {
    this.filteredClients = this.filteredClientsList;
    this.updateDisplayedClients();
  }

  updateDisplayedClients(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedClients = this.filteredClients.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getUserImageUrl(user: User): string | null {
    if (user && user.profilePicture) {
      return `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
    }
    return null;
  }

  getUserInitials(user: User): string {
    let initials = '';
    if (user.firstname) {
      initials += user.firstname.charAt(0).toUpperCase();
    }
    if (user.lastname) {
      initials += user.lastname.charAt(0).toUpperCase();
    }
    return initials || '?';
  }

  handleImageError(event: any): void {
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }

  viewClientServices(clientId: number | undefined): void {
    if (clientId === undefined) {
      console.error('Client ID not defined');
      this.errorMessage = 'Client ID not defined';
      return;
    }
    this.router.navigate(['/back-office/user/selectedservices', clientId]);
  }

  navigateBack(): void {
    this.router.navigate(['/back-office/partner', this.partnerId]);
  }

  protected readonly Math = Math;
  viewClientDetails(clientId: number | undefined): void {
    if (clientId === undefined) {
      console.error('Client ID not defined');
      this.errorMessage = 'Client ID not defined';
      return;
    }
    this.router.navigate(['/back-office/user', clientId]);
  }
}