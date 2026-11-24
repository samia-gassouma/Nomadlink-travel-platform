import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { ServiceControllerService } from "../../../services/gestionUser/services/service-controller.service";
import { Services } from "../../../services/gestionUser/models/services";
import { API_BASE_URL } from "../constants/api"; // Import the API base URL

@Component({
    selector: 'app-mycreatedservicespartner',
    templateUrl: './mycreatedservicespartner.component.html',
    styleUrl: './mycreatedservicespartner.component.scss'
})
export class MycreatedservicespartnerComponent implements OnInit {
    services: Services[] = [];
    currentUserId: number | null = null;
    isLoading = false;
    errorMessage = '';
    apiBaseUrl = API_BASE_URL;

    // For filtering and searching
    searchTerm = '';
    selectedCategory = '';
    selectedStatus = '';

    // For sorting
    sortBy = 'none';
    sortOrder: 'asc' | 'desc' = 'asc';

    // For pagination
    itemsPerPage = 8;
    currentPage = 1;
    displayedServices: Services[] = [];

    // Service categories for filter
    serviceCategories = [
        'ACCOMMODATION', 'TRANSPORT', 'TOUR_GUIDE', 'ACTIVITY',
        'RESTAURANT', 'WELLNESS', 'ENTERTAINMENT', 'SHOPPING',
        'ADVENTURE', 'EVENT', 'SPORTS', 'CRUISE', 'CULTURE',
        'EQUIPMENT_RENTAL', 'TRAVEL_INSURANCE', 'OTHER'
    ];

    // Status options
    statusOptions = ['DISPONIBLE', 'INDISPONIBLE'];

    // Sorting options
    sortOptions = [
        { value: 'none', label: 'No Sorting' },
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'price', label: 'Price' },
        { value: 'date', label: 'Date (Newest First)' }
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
                        this.loadPartnerServices(userId);
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

    loadPartnerServices(partnerId: number): void {
        this.isLoading = true;
        this.serviceController.getAllServicesOfPartner({ partnerId })
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(
                services => {
                    this.services = services;
                    console.log('Services loaded:', services);
                    this.updateDisplayedServices();
                },
                error => {
                    console.error('Error loading services', error);
                    this.errorMessage = 'Unable to load services. Please try again.';
                }
            );
    }

    editService(serviceId: number | undefined): void {
        if (serviceId === undefined) {
            console.error('Service ID not defined');
            this.errorMessage = 'Service ID not defined';
            return;
        }
        this.router.navigate(['/front-office/updatemyservicepartner', serviceId]);
    }

    deleteService(serviceId: number | undefined): void {
        if (serviceId === undefined) {
            console.error('Service ID not defined');
            this.errorMessage = 'Service ID not defined';
            return;
        }

        if (confirm('Are you sure you want to delete this service?')) {
            this.isLoading = true;
            this.serviceController.deleteService({ id: serviceId })
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe(
                    () => {
                        this.services = this.services.filter(service => service.id !== serviceId);
                        console.log('Service successfully deleted');
                        this.updateDisplayedServices();
                    },
                    error => {
                        console.error('Error deleting service', error);
                        this.errorMessage = 'Unable to delete service. Please try again.';
                    }
                );
        }
    }

    createNewService(): void {
        this.router.navigate(['/front-office/createservicepartner']);
    }

    // Filter for search, category, and status
    get filteredServices(): Services[] {
        let result = this.services.filter(service => {
            // Filter by search term
            const matchesSearch = !this.searchTerm ||
                service.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                service.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

            // Filter by category
            const matchesCategory = !this.selectedCategory || service.category === this.selectedCategory;

            // Filter by status
            const matchesStatus = !this.selectedStatus || service.status === this.selectedStatus;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        // Apply sorting
        result = this.sortServices(result);

        return result;
    }

    // Sort services based on selected criteria
    sortServices(services: Services[]): Services[] {
        if (this.sortBy === 'none') return services;

        return [...services].sort((a, b) => {
            let comparison = 0;

            switch (this.sortBy) {
                case 'name':
                    comparison = this.compareValues(a.name, b.name);
                    break;
                case 'price':
                    comparison = this.compareValues(a.price, b.price);
                    break;
                case 'date':
                    // Using ID as proxy for creation date (higher ID = newer)
                    comparison = this.compareValues(b.id, a.id); // Note: reversed to show newest first
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
        this.updateDisplayedServices();
    }

    // Change sorting criteria
    changeSortBy(sortBy: string): void {
        if (this.sortBy === sortBy) {
            this.toggleSortOrder();
        } else {
            this.sortBy = sortBy;
            this.sortOrder = 'asc';
        }
        this.updateDisplayedServices();
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.selectedCategory = '';
        this.selectedStatus = '';
        this.sortBy = 'none';
        this.sortOrder = 'asc';
        this.currentPage = 1;
        this.updateDisplayedServices();
    }

    // Pagination
    pageChanged(page: number): void {
        this.currentPage = page;
        this.updateDisplayedServices();
    }

    updateDisplayedServices(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedServices = this.filteredServices.slice(startIndex, startIndex + this.itemsPerPage);
    }

    getIconForCategory(category?: string): string {
        if (!category) return 'fa-question';

        switch (category) {
            case 'ACCOMMODATION':
                return 'fa-hotel';
            case 'TRANSPORT':
                return 'fa-car';
            case 'TOUR_GUIDE':
                return 'fa-map';
            case 'ACTIVITY':
                return 'fa-hiking';
            case 'RESTAURANT':
                return 'fa-utensils';
            case 'WELLNESS':
                return 'fa-spa';
            case 'ENTERTAINMENT':
                return 'fa-ticket-alt';
            case 'SHOPPING':
                return 'fa-shopping-cart';
            case 'ADVENTURE':
                return 'fa-mountain';
            case 'EVENT':
                return 'fa-calendar-alt';
            case 'SPORTS':
                return 'fa-running';
            case 'CRUISE':
                return 'fa-ship';
            case 'CULTURE':
                return 'fa-landmark';
            case 'EQUIPMENT_RENTAL':
                return 'fa-tools';
            case 'TRAVEL_INSURANCE':
                return 'fa-umbrella';
            case 'OTHER':
            default:
                return 'fa-question';
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
        event.target.nextElementSibling.style.display = 'flex';
    }

    viewServiceDetails(serviceId: number | undefined): void {
        if (serviceId === undefined) {
            console.error('Service ID not defined');
            this.errorMessage = 'Service ID not defined';
            return;
        }
        this.router.navigate(['/front-office/service-details', serviceId]);
    }

    protected readonly Math = Math;
}