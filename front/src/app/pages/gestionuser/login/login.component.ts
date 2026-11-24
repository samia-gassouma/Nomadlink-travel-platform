import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from "../../../services/gestionUser/models/authentication-request";
import { AuthenticationControllerService } from "../../../services/gestionUser/services/authentication-controller.service";
import { TokenService } from "../../../services/gestionUser/token/token.service";
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { RoleService } from "../../../services/gestionUser/service_me/role.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];
  loading = false;
  passwordVisible = false;


  constructor(
      private router: Router,
      private authService: AuthenticationControllerService,
      private tokenService: TokenService,
      private currentUserService: CurrentuserService,
      private roleService: RoleService
  ) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  login() {
    // Clear previous errors
    this.errorMsg = [];

    // Validate inputs before sending to the server
    if (!this.authRequest.email || !this.authRequest.email.trim()) {
      this.errorMsg.push('Email is required');
      return;
    }

    if (!this.authRequest.password || !this.authRequest.password.trim()) {
      this.errorMsg.push('Password is required');
      return;
    }

    this.loading = true;

    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        console.log('Authentication successful');
        if (res && res.token) {
          this.tokenService.token = res.token as string;

          // Chargement des données de l'utilisateur après authentification réussie
          this.currentUserService.loadCurrentUser().then(user => {
            this.loading = false;
            console.log('User loaded after login:', user);

            if (user) {
              // Redirection basée sur le rôle de l'utilisateur
              switch (user.role) {
                case 'ADMIN':
                  console.log('Redirecting ADMIN to /users');
                  this.router.navigate(['/back-office/users']);
                  break;
                case 'USER':
                  // Vérifier si l'utilisateur a sélectionné ses préférences
                  if (user.hasSelectedPreferences) {
                    console.log('USER has preferences, redirecting to home-v1');
                    this.router.navigate(['/home-v1']);
                  } else {
                    console.log('USER has no preferences, redirecting to selectpreferences');
                    this.router.navigate(['/front-office/selectpreferences']);
                  }
                  break;
                case 'PARTNER':
                  console.log('Redirecting PARTNER to home v2');
                  this.router.navigate(['/home-v2']);
                  break;
                default:
                  console.log('No specific role, redirecting to default page');
                  this.router.navigate(['/home-v1']);
                  break;
              }
            } else {
              // Si aucun utilisateur n'est chargé, redirection vers la page par défaut
              console.log('No user data, redirecting to default page');
              this.router.navigate(['/front-office/selectpreferences']);
            }
          });
        } else {
          this.errorMsg.push('Invalid authentication response');
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Authentication error:', err);
        this.loading = false;

        // Handle different error cases
        if (err.error) {
          if (err.error.validationErrors && err.error.validationErrors.length) {
            this.errorMsg = err.error.validationErrors;
          } else if (err.error.errorMsg) {
            this.errorMsg.push(err.error.errorMsg);
          } else if (err.status === 401) {
            this.errorMsg.push('Invalid email or password');
          } else {
            this.errorMsg.push('An error occurred during authentication');
          }
        } else {
          this.errorMsg.push('Unable to connect to the server');
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}