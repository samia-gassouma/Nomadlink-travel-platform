import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { TokenService } from "../token/token.service";
import { CurrentuserService } from "../service_me/currentuser.service";
import { map, switchMap, first, catchError, timeout } from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardS implements CanActivate {

    constructor(
        private tokenService: TokenService,
        private currentUserService: CurrentuserService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        console.log('AuthGuard - Checking route:', state.url);

        // First, check if there's a token
        if (!this.tokenService.isLogged()) {
            console.log('AuthGuard - No token found, redirecting to login');
            return this.router.createUrlTree(['/login'], {
                queryParams: { returnUrl: state.url }
            });
        }

        // For routes without restrictions
        if (!route.data || (!route.data['roles'] && !route.data['userAccess'] && !route.data['partnerAccess'])) {
            console.log('AuthGuard - No role restrictions, access granted');
            return true;
        }

        // Force user loading and wait for it to complete
        return this.loadAndVerifyUser(route, state);
    }

    private loadAndVerifyUser(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        console.log('Loading and verifying user for route:', state.url);

        // Force a reload of user data to ensure we have the latest
        this.currentUserService.loadCurrentUser();

        return this.currentUserService.isLoading().pipe(
            // Wait until loading is complete
            first(loading => !loading),
            // Then get the current user
            switchMap(() => this.currentUserService.getCurrentUser().pipe(
                first(),
                map(user => {
                    if (!user) {
                        console.log('User data not available after loading, redirecting to login');
                        this.tokenService.logout(); // Token might be invalid
                        return this.router.createUrlTree(['/login']);
                    }

                    console.log('User data loaded:', user);
                    const { roles, userAccess, partnerAccess } = route.data;

                    // Check role restrictions if specified
                    if (roles && Array.isArray(roles)) {
                        console.log('Checking roles:', roles, 'User role:', user.role);
                        if (!roles.includes(user.role)) {
                            console.log('Role not authorized, redirecting');
                            if (user.role === 'ADMIN') {
                                return this.router.createUrlTree(['/back-office']);
                            } else {
                                return this.router.createUrlTree(['/front-office']);
                            }
                        }
                    }

                    // Check specific access for USER
                    if (userAccess === true) {
                        console.log('Checking USER access, user role:', user.role);
                        if (user.role !== 'USER') {
                            console.log('Not a USER, redirecting');
                            return this.router.createUrlTree(['/front-office']);
                        }
                    }

                    // Check specific access for PARTNER
                    if (partnerAccess === true) {
                        console.log('Checking PARTNER access, user role:', user.role);
                        if (user.role !== 'PARTNER') {
                            console.log('Not a PARTNER, redirecting');
                            return this.router.createUrlTree(['/front-office']);
                        }
                    }

                    console.log('All checks passed, access granted');
                    return true;
                })
            )),
            // Handle any errors during the process
            catchError(error => {
                console.error('Error in auth guard:', error);
                return of(this.router.createUrlTree(['/login']));
            }),
            // Add a timeout to prevent infinite waiting
            timeout(5000),
            catchError(error => {
                console.error('Timeout in auth guard:', error);
                return of(this.router.createUrlTree(['/login']));
            })
        );
    }
}