import { Component, OnInit } from '@angular/core';
import { User } from "../../../services/gestionUser/models/user";
import { UserControllerService } from "../../../services/gestionUser/services/user-controller.service";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { API_BASE_URL } from "../constants/api"; // Importez votre constante API_BASE_URL

@Component({
    selector: 'app-user-list-component',
    templateUrl: './user-list-component.component.html',
    styleUrls: ['./user-list-component.component.scss'] // Changé en .scss
})
export class UserListComponentComponent implements OnInit {

    // Liste des utilisateurs
    users: User[] = [];
    filteredUsers: User[] = [];
    displayedUsers: User[] = [];
    isLoading: boolean = false;
    apiBaseUrl = API_BASE_URL;

    // Contrôles de recherche et filtrage
    searchTerm = new FormControl('');
    searchField = new FormControl('email');
    sortOrder = new FormControl('latestModified');
    statusFilter = new FormControl('all');

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;



    constructor(
        private userService: UserControllerService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadUsers();

        // Réagir aux changements de recherche et filtres
        this.searchTerm.valueChanges.subscribe(() => {
            this.currentPage = 1; // Retour à la première page lors d'une recherche
            this.applyFilters();
        });

        this.searchField.valueChanges.subscribe(() => {
            this.currentPage = 1;
            this.applyFilters();
        });

        this.sortOrder.valueChanges.subscribe(() => {
            this.applyFilters();
        });

        this.statusFilter.valueChanges.subscribe(() => {
            this.currentPage = 1;
            this.applyFilters();
        });
    }

    loadUsers(): void {
        this.isLoading = true;
        this.userService.getAllUsers()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (data) => {
                    this.users = data;
                    this.applyFilters();
                    console.log('Users loaded:', this.users);
                },
                error: (error) => {
                    console.error('Error while fetching users', error);
                }
            });
    }

    // Nouvelle méthode pour l'URL de l'image de l'utilisateur
    getUserImageUrl(user: User): string | null {
        if (user && user.profilePicture) {
            return `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
        }
        return null;
    }

    // Nouvelle méthode pour obtenir les initiales de l'utilisateur comme alternative à l'image
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

    // Nouvelle méthode pour gérer les erreurs d'image
    handleImageError(event: any): void {
        event.target.style.display = 'none';
        const parent = event.target.parentElement;

        // Créer un élément div pour les initiales
        const placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'avatar-placeholder';

        // Trouver l'utilisateur correspondant pour obtenir les initiales
        const userId = Number(parent.getAttribute('data-user-id'));
        const user = this.displayedUsers.find(u => u.id === userId);

        if (user) {
            placeholderDiv.textContent = this.getUserInitials(user);
        } else {
            placeholderDiv.textContent = '?';
        }

        parent.appendChild(placeholderDiv);
    }

    applyFilters(): void {
        let result = [...this.users];

        // Appliquer la recherche
        if (this.searchTerm.value) {
            const term = this.searchTerm.value.toLowerCase();
            const field = this.searchField.value || 'email';

            result = result.filter(user => {
                switch(field) {
                    case 'email':
                        return user.email ? user.email.toLowerCase().includes(term) : false;
                    case 'firstname':
                        return user.firstname ? user.firstname.toLowerCase().includes(term) : false;
                    case 'phoneNumber':
                        return user.phoneNumber ? user.phoneNumber.toLowerCase().includes(term) : false;
                    default:
                        return false;
                }
            });
        }

        // Appliquer le filtre de statut
        if (this.statusFilter.value !== 'all') {
            const isEnabled = this.statusFilter.value === 'active';
            result = result.filter(user => user.enabled === isEnabled);
        }

        // Appliquer le tri
        result.sort((a, b) => {
            switch (this.sortOrder.value) {
                case 'latestModified':
                    // Trier par date de dernière modification (du plus récent au plus ancien)
                    const dateModA = a.lastModifiedDate || '';
                    const dateModB = b.lastModifiedDate || '';
                    return dateModA > dateModB ? -1 : 1;

                case 'oldestModified':
                    // Trier par date de dernière modification (du plus ancien au plus récent)
                    const dateModOldA = a.lastModifiedDate || '';
                    const dateModOldB = b.lastModifiedDate || '';
                    return dateModOldA < dateModOldB ? -1 : 1;

                case 'latestCreated':
                    // Trier par date de création (du plus récent au plus ancien)
                    const dateCreateA = a.createdDate || '';
                    const dateCreateB = b.createdDate || '';
                    return dateCreateA > dateCreateB ? -1 : 1;

                case 'oldestCreated':
                    // Trier par date de création (du plus ancien au plus récent)
                    const dateCreateOldA = a.createdDate || '';
                    const dateCreateOldB = b.createdDate || '';
                    return dateCreateOldA < dateCreateOldB ? -1 : 1;

                default:
                    return 0;
            }
        });

        this.filteredUsers = result;
        this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        this.updateDisplayedUsers();
    }

    updateDisplayedUsers(): void {
        // Calculer l'index de début et de fin pour la pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredUsers.length);

        // Mettre à jour les utilisateurs affichés
        this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
    }

    changePage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.updateDisplayedUsers();
    }

    nextPage(): void {
        this.changePage(this.currentPage + 1);
    }

    prevPage(): void {
        this.changePage(this.currentPage - 1);
    }

    getPageArray(): number[] {
        // Créer un tableau pour l'affichage des numéros de page avec limite à 5 pages visibles
        const totalPages = this.totalPages;
        const currentPage = this.currentPage;

        if (totalPages <= 5) {
            // Si moins de 5 pages, afficher toutes les pages
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            // Sinon, montrer 5 pages centrées autour de la page actuelle
            if (currentPage <= 3) {
                // Premières pages
                return [1, 2, 3, 4, 5];
            } else if (currentPage >= totalPages - 2) {
                // Dernières pages
                return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                // Pages du milieu
                return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
            }
        }
    }

    // Nouvelle méthode pour naviguer vers la création d'utilisateur
    navigateToCreateUser(): void {
        this.router.navigate(['/back-office/createuser']);
    }

    onEdit(userId: number | undefined): void {
        if (userId !== undefined) {
            this.router.navigate(['/back-office/user/update', userId]);
        } else {
            console.error('User ID is undefined');
        }
    }

    onDelete(userId: number | undefined): void {
        if (userId === undefined) {
            console.error('User ID is undefined');
            return;
        }

        if (confirm('Are you sure you want to delete this user?')) {
            this.isLoading = true;
            this.userService.deleteUser({ id: userId })
                .pipe(finalize(() => this.isLoading = false))
                .subscribe({
                    next: () => {
                        console.log('User deleted successfully');
                        // Reload the user list after deletion
                        this.loadUsers();
                    },
                    error: (error) => {
                        console.error('Error while deleting user', error);
                    }
                });
        }
    }

    onViewDetails(userId: number | undefined): void {
        if (userId !== undefined) {
            this.router.navigate(['/back-office/user', userId]);
        } else {
            console.error('User ID is undefined');
        }
    }

    protected readonly Math = Math;
    resetFilters(): void {
        this.searchTerm.setValue('');
        this.searchField.setValue('email');
        this.sortOrder.setValue('latestModified');
        this.statusFilter.setValue('all');
        this.currentPage = 1;
        this.applyFilters();
    }

// Méthode qui retourne le nombre d'utilisateurs actifs
    getActiveUsersCount(): number {
        return this.users.filter(user => user.enabled).length;
    }

// Méthode qui retourne le nombre d'utilisateurs inactifs
    getInactiveUsersCount(): number {
        return this.users.filter(user => !user.enabled).length;
    }
}