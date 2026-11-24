import {Component, OnInit, EventEmitter, Output, Inject, ViewChild, TemplateRef, HostListener} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventService } from '../../core/services/event.service';

//Logout
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';

// Language
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { allNotification, messages } from './data'
import { CartModel } from './topbar.model';
import { cartData } from './data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {TokenService} from "../../../services/gestionUser/token/token.service";
import {CurrentuserService} from "../../../services/gestionUser/service_me/currentuser.service";
import {User} from "../../../services/gestionUser/models/user";
import {API_BASE_URL} from "../../../pages/gestionuser/constants/api";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  messages: any
  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  total = 0;

  constructor(

      private modalService: NgbModal,
      private router: Router,
      private TokenStorageService: TokenStorageService,

  //////////////////////////////////////////////////
  // Add these new services
  private tokenService: TokenService,
  private currentUserService: CurrentuserService,) { }
  //////////////////////////////////////////////////

  ngOnInit(): void {
    //////////////////////////////////////////////////
    // Add this new code
    this.isUserLoggedIn = this.tokenService.isLogged();

    this.currentUserService.getCurrentUser().subscribe(user => {
      this.currentUser = user;

      // Construct profile picture URL if available
      if (user && user.profilePicture) {
        this.imageUrl = `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
      } else {
        this.imageUrl = null;
      }
    });

    if (this.isUserLoggedIn) {
      this.currentUserService.loadCurrentUser();
    }
    //////////////////////////////////////////////////

  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }




  windowScroll() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
      document.getElementById('page-topbar')?.classList.add('topbar-shadow');
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow');
    }
  }



// In your TopbarComponent class add these properties:
  isUserLoggedIn: boolean = false;
  currentUser: User | null = null;
  dropdownOpen: boolean = false;
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;

  // Add these methods:
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

// Updated logout method
  logout(): void {
    this.tokenService.logout();
    this.isUserLoggedIn = false;
    this.currentUser = null;
    this.imageUrl = null;
    this.router.navigate(['/login']);
  }

  handleImageError(): void {
    this.imageUrl = null;
  }

// Add click outside listener to close dropdown
  @HostListener('document:click', ['$event'])
  clickOutside(event: any): void {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown && !userDropdown.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

// Navigation method for profile
  navigateToProfile(): void {
    if (this.currentUser) {
        // Default to USER profile
        this.router.navigate(['/back-office/myprofileadmin']);
      }

  }
// Add this method to your TopbarComponent class
  navigateToFrontOffice(): void {
    this.router.navigate(['/front-office/home-v2']);
  }



}
