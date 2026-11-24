import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { User } from "../../../services/gestionUser/models/user";
import { API_BASE_URL } from "../constants/api";

@Component({
  selector: 'app-service-clients',
  templateUrl: './service-clients.component.html',
  styleUrl: './service-clients.component.scss'
})
export class ServiceClientsComponent implements OnInit {
    clients: User[] = [];
    currentUserId: number | null = null;
    isLoading = false;
    errorMessage = '';
    apiBaseUrl = API_BASE_URL;

    // For filtering and searching
    searchTerm = '';

    // For sorting
    sortBy = 'none';
    sortOrder: 'asc' | 'desc' = 'asc';

    // For pagination
    itemsPerPage = 10;
    currentPage = 1;
    displayedClients: User[] = [];

    // Sorting options
    sortOptions = [
        { value: 'none', label: 'No Sorting' },
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'email', label: 'Email (A-Z)' },
    ];

    constructor(
        private serviceController: ServiceControllerService,
        private currentuserService: CurrentuserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCurrentUser();
    }

    loadCurrentUser(): void {
        this.isLoading = true;
        this.currentuserService.getCurrentUserId()
            .subscribe(
                userId => {
                    this.currentUserId = userId;
                    if (userId) {
                        this.loadPartnerClients(userId);
                    } else {
                        this.isLoading = false;
                        this.errorMessage = 'User not logged in or not authorized';
                    }
                },
                error => {
                    console.error('Error retrieving user', error);
                    this.isLoading = false;
                    this.errorMessage = 'Error retrieving user information';
                }
            );
    }

    loadPartnerClients(partnerId: number): void {
        this.isLoading = true;
        this.serviceController.getClientsOfPartner({ partnerId })
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(
                clients => {
                    this.clients = clients;
                    console.log('Clients loaded:', clients);
                    this.updateDisplayedClients();
                },
                error => {
                    console.error('Error loading clients', error);
                    this.errorMessage = 'Unable to load clients. Please try again.';
                }
            );
    }

    // Filter for search
    get filteredClients(): User[] {
        let result = this.clients.filter(client => {
            // Filter by search term
            const matchesSearch = !this.searchTerm ||
                client.firstname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                client.lastname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                client.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                client.phoneNumber?.toLowerCase().includes(this.searchTerm.toLowerCase());

            return matchesSearch;
        });

        // Apply sorting
        result = this.sortClients(result);

        return result;
    }

    // Sort clients based on selected criteria
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

            // Apply sort order (asc/desc)
            return this.sortOrder === 'asc' ? comparison : -comparison;
        });
    }

    // Helper method for comparing values safely
    compareValues(a: any, b: any): number {
        if (a === undefined && b === undefined) return 0;
        if (a === undefined) return -1;
        if (b === undefined) return 1;

        if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        }

        return a - b;
    }

    // Toggle sort order when clicking on the same sorting option
    toggleSortOrder(): void {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.updateDisplayedClients();
    }

    // Change sorting criteria
    changeSortBy(sortBy: string): void {
        if (this.sortBy === sortBy) {
            this.toggleSortOrder();
        } else {
            this.sortBy = sortBy;
            this.sortOrder = 'asc';
        }
        this.updateDisplayedClients();
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.sortBy = 'none';
        this.sortOrder = 'asc';
        this.currentPage = 1;
        this.updateDisplayedClients();
    }

    // Pagination
    pageChanged(page: number): void {
        this.currentPage = page;
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
        this.router.navigate(['/front-office/client-service-selected', clientId]);
    }

    protected readonly Math = Math;
}