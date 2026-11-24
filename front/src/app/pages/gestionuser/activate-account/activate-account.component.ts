import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationControllerService } from "../../../services/gestionUser/services/authentication-controller.service";

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  message = '';
  isOkay = true;
  submitted = false;
  token: string = '';

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private authService: AuthenticationControllerService
  ) {}

  ngOnInit() {
    // Check if token is in URL parameters for direct link activation
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.confirmAccount(this.token);
      }
    });
  }

  private confirmAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = 'Your account has been successfully activated.';
        this.submitted = true;
        this.isOkay = true;
      },
      error: (err) => {
        this.message = err?.error?.message || 'Token has been expired or is invalid';
        this.submitted = true;
        this.isOkay = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }
}