import { Injectable } from '@angular/core';
import { CurrentuserService } from './currentuser.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private currentUserService: CurrentuserService) {}

  // Vérifie si l'utilisateur a un rôle spécifique
  hasRole(role: string): Observable<boolean> {
    return this.currentUserService.getCurrentUser().pipe(
        map(user => user?.role === role)
    );
  }

  // Vérifie si l'utilisateur a l'un des rôles spécifiés
  hasAnyRole(roles: string[]): Observable<boolean> {
    return this.currentUserService.getCurrentUser().pipe(
        map(user => user ? roles.includes(user.role || '') : false)
    );
  }

  // Vérifie si l'utilisateur est un ADMIN
  isAdmin(): Observable<boolean> {
    return this.hasRole('ADMIN');
  }

  // Vérifie si l'utilisateur est un USER
  isUser(): Observable<boolean> {
    return this.hasRole('USER');
  }

  // Vérifie si l'utilisateur est un PARTNER
  isPartner(): Observable<boolean> {
    return this.hasRole('PARTNER');
  }
}