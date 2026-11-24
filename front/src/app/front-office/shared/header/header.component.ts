import { Component, OnInit, HostListener } from '@angular/core';
import { HelperService } from '../../helper/helper.service';
import { TokenService } from "../../../services/gestionUser/token/token.service";
import { User } from "../../../services/gestionUser/models/user";
import { CurrentuserService } from "../../../services/gestionUser/service_me/currentuser.service";
import { Router } from "@angular/router";
import { API_BASE_URL} from "../../../pages/gestionuser/constants/api";
import { CartService, ProductItem } from '../../services/boutique/cart/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends HelperService implements OnInit {

  isUserLoggedIn: boolean = false;
  currentUser: User | null = null;
  dropdownOpen: boolean = false;
  imageUrl: string | null = null;
  apiBaseUrl = API_BASE_URL;


  //sarra
  cartItemCount: number = 0;
  cartItems: ProductItem[] = []; // Ajoute cette variable pour stocker les articles du panier
  showCartDropdown: boolean = false;


  constructor(
      private tokenService: TokenService,
      private currentUserService: CurrentuserService,
      private router: Router,
      private cartService: CartService
  ) {
    super();
  }

  override ngOnInit(): void {

    this.isUserLoggedIn = this.tokenService.isLogged();
    console.log('État de connexion:', this.isUserLoggedIn ? 'Connecté' : 'Non connecté');
    super.ngOnInit();
    this.cartService.getCart().subscribe((cart: ProductItem[]) => {
      this.cartItems = cart;  // Mets à jour la liste des articles dans le panier
      this.cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);  // Calcul du nombre total d'articles
    });
    this.currentUserService.getCurrentUser().subscribe(user => {
      this.currentUser = user;

      // Construct profile picture URL if available
      if (user && user.profilePicture) {
        this.imageUrl = `${this.apiBaseUrl}/uploads/${user.profilePicture}`;
      } else {
        this.imageUrl = null;
      }

      console.log('Utilisateur actuel:', user);
    });

    if (this.isUserLoggedIn) {
      this.currentUserService.loadCurrentUser();
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.tokenService.logout();
    this.isUserLoggedIn = false;
    this.currentUser = null;
    this.imageUrl = null;
    this.router.navigate(['/login']);
  }

  // Handle image error
  handleImageError(): void {
    this.imageUrl = null;
  }

  // Fermer le dropdown quand on clique ailleurs
  @HostListener('document:click', ['$event'])
  clickOutside(event: any): void {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown && !userDropdown.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }


  // Nouvelle méthode pour rediriger vers le bon profil selon le rôle
  navigateToProfile(): void {
    if (this.currentUser) {
      if (this.currentUser.role === 'PARTNER') {
        this.router.navigate(['/front-office/myprofilepartner']);
      } else {
        // Par défaut, on redirige vers le profil USER
        this.router.navigate(['/front-office/myprofileuser']);
      }
    }
  }

  toggleCartDropdown() {
    this.showCartDropdown = !this.showCartDropdown; // Toggle l'affichage du dropdown
  }

  // Optionnel : Redéfinition de la méthode pour récupérer le panier
  override getCart(): any[] {
    return super.getCart();
  }
}