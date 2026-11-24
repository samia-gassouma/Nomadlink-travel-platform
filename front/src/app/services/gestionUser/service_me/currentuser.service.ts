import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from "rxjs";
import { User } from "../models/user";
import { AuthenticationControllerService } from "../services/authentication-controller.service";
import { catchError, tap, finalize, delay, share } from "rxjs/operators";
import { TokenService } from "../token/token.service";

@Injectable({
    providedIn: 'root'
})
export class CurrentuserService {
    private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    private currentUserIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private loadAttempted: boolean = false;
    private loadingPromise: Promise<User | null> | null = null;

    constructor(
        private authService: AuthenticationControllerService,
        private tokenService: TokenService
    ) {
        console.log('CurrentuserService initialized');
        // Load user automatically if token exists, but only once
        if (this.tokenService.isLogged() && !this.loadAttempted) {
            console.log('Token exists, loading user data');
            this.loadCurrentUser();
        } else {
            console.log('No token available or load already attempted');
        }
    }

    // Get current user
    getCurrentUser(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    // Get current user ID
    getCurrentUserId(): Observable<number | null> {
        return this.currentUserIdSubject.asObservable();
    }

    // Check if loading is in progress
    isLoading(): Observable<boolean> {
        return this.isLoadingSubject.asObservable();
    }

    // Load current user data
    loadCurrentUser(): Promise<User | null> {
        console.log('loadCurrentUser called');
        this.loadAttempted = true;

        // Return existing promise if already loading
        if (this.loadingPromise) {
            console.log('Using existing loading promise');
            return this.loadingPromise;
        }

        // Check if token exists
        if (!this.tokenService.isLogged()) {
            console.log('No token available, resetting user data');
            this.resetUserData();
            return Promise.resolve(null);
        }

        console.log('Starting user data loading');
        this.isLoadingSubject.next(true);

        // Create a new loading promise
        this.loadingPromise = new Promise<User | null>((resolve) => {
            // Add a small delay to ensure the token is processed
            this.authService.getCurrentUser()
                .pipe(
                    delay(100), // Small delay to ensure token is processed
                    tap(response => console.log('API response received:', response)),
                    catchError(error => {
                        console.error('Error loading user data:', error);

                        // Handle auth errors by logging out
                        if (error.status === 401 || error.status === 403) {
                            console.log('Authentication error, logging out');
                            this.tokenService.logout();
                        }

                        return of(null);
                    }),
                    finalize(() => {
                        console.log('Loading completed');
                        this.isLoadingSubject.next(false);
                        this.loadingPromise = null;
                    })
                )
                .subscribe(
                    (user: User | null) => {
                        if (user) {
                            console.log('User data loaded successfully:', user);
                            const userId = user.id !== undefined ? user.id : null;
                            this.currentUserSubject.next(user);
                            this.currentUserIdSubject.next(userId);
                            resolve(user);
                        } else {
                            console.log('No user data available, resetting');
                            this.resetUserData();
                            resolve(null);
                        }
                    }
                );
        });

        return this.loadingPromise;
    }

    // Reset user data
    private resetUserData(): void {
        console.log('Resetting user data');
        this.currentUserSubject.next(null);
        this.currentUserIdSubject.next(null);
        this.isLoadingSubject.next(false);
    }

    // Force reset and reload user data
    forceReloadUser(): Promise<User | null> {
        this.resetUserData();
        this.loadingPromise = null;
        if (this.tokenService.isLogged()) {
            return this.loadCurrentUser();
        }
        return Promise.resolve(null);
    }
}