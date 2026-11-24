import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import {CurrentuserService} from "../service_me/currentuser.service";
import {TokenService} from "../token/token.service";

@Injectable({
    providedIn: 'root'
})
export class LoginGuard  implements CanActivate {
    constructor(
        private router: Router,
        private tokenService: TokenService,
        private currentUserService: CurrentuserService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // If user is not logged in, allow access to login page
        if (!this.tokenService.isLogged()) {
            return true;
        }

        // User is logged in, redirect based on role
        return new Observable<boolean>(observer => {
            this.currentUserService.loadCurrentUser()
                .then(user => {
                    if (user) {
                        // Redirect based on user role
                        switch (user.role) {
                            case 'ADMIN':
                                this.router.navigate(['/back-office/users']);
                                break;
                            case 'USER':
                                this.router.navigate(['/home-v1']);
                                break;
                            case 'PARTNER':
                                this.router.navigate(['/home-v2']);
                                break;
                            default:
                                this.router.navigate(['/home-v1']);
                                break;
                        }
                        observer.next(false); // Prevent access to login page
                    } else {
                        observer.next(true); // Allow access if user data couldn't be loaded
                    }
                    observer.complete();
                })
                .catch(() => {
                    observer.next(true); // Allow access if there was an error loading user
                    observer.complete();
                });
        });
    }
}