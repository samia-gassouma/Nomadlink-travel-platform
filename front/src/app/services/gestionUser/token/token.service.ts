import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  // set token(token: string) {
  //   localStorage.setItem('token', token);
  // }
  //
  // get token() {
  //   return localStorage.getItem('token') as string;
  // }
// In token.service.ts
  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


  isLogged(): boolean {
    // Vérifier simplement si un token existe
    return !!this.token;
  }

  logout(): void {
    localStorage.removeItem('token');
    // Vous pouvez ajouter d'autres actions de déconnexion ici
  }




  // isTokenValid() {
  //   const token = this.token;
  //   if (!token) {
  //     return false;
  //   }
  //   // decode the token
  //   const jwtHelper = new JwtHelperService();
  //   // check expiry date
  //   const isTokenExpired = jwtHelper.isTokenExpired(token);
  //   if (isTokenExpired) {
  //     localStorage.clear();
  //     return false;
  //   }
  //   return true;
  // }
  //
  // isTokenNotValid() {
  //   return !this.isTokenValid();
  // }
  //
  // get userRoles(): string[] {
  //   const token = this.token;
  //   if (token) {
  //     const jwtHelper = new JwtHelperService();
  //     const decodedToken = jwtHelper.decodeToken(token);
  //     console.log(decodedToken.authorities);
  //     return decodedToken.authorities;
  //   }
  //   return [];
  // }
}
