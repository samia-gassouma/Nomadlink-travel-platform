import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, ProductItem } from 'src/app/front-office/services/boutique/cart/cart.service';
import { CommandeService } from 'src/app/front-office/services/boutique/commande/commande.service';
import { ProduitService } from 'src/app/front-office/services/boutique/produit/produit.service';
import Swal from 'sweetalert2';
import {Commande} from "../../../models/boutique/commande.model";
import { CurrentuserService } from 'src/app/services/gestionUser/service_me/currentuser.service';
import { User } from 'src/app/services/gestionUser/models';

@Component({
  selector: 'app-cartproduct',
  templateUrl: './cartproduct.component.html',
  styleUrls: ['./cartproduct.component.scss']
})
export class CartproductComponent implements OnInit {

  cartItems: ProductItem[] = [];
  promoCode: string = '';
  discount: number = 0;
  showCommandePopup: boolean = false;
  isLoading: boolean = false;
   currentUser: User | null = null;
  commande: Commande = {
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    total: 0,
    dateCommande: new Date(),
    statut: 'EN_ATTENTE',
    lignesCommande: []
  };

  constructor(
    public  cartService: CartService,
    private commandeService: CommandeService,
    private produitService: ProduitService,
    private currentuserService: CurrentuserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
    this.currentuserService.loadCurrentUser();

    // Subscribe to subjects to get information
    this.currentuserService.getCurrentUser().subscribe((user: User | null) => {
      this.currentUser = user;
      if (user) {
        this.commande.nom = user.firstname || 'Not provided';
        this.commande.prenom = user.lastname || 'Not provided';
        this.commande.telephone = user.phoneNumber || 'Not provided';
        this.commande.adresse = user.address || 'Not provided';
      }
    });
  
  }

  // Méthodes pour gérer la quantité des produits
  decrementQuantity(item: ProductItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCartItem(item);
    }
  }

  incrementQuantity(item: ProductItem): void {
    item.quantity++;
    this.cartService.updateCartItem(item);
  }

  // Affiche la popup et prépare la commande
  goToCommande(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Panier vide',
        text: 'Votre panier est vide. Veuillez ajouter des produits pour passer commande.',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.isLoading = true;
    const verifications = this.cartItems.map(item =>
      this.produitService.getProductById(item.id).toPromise().then(produit => {
        if (!produit) {
          throw {
            nom: 'Produit inconnu',
            stock: 0
          };
        }
  
        if (item.quantity > produit.stock) {
          throw {
            nom: produit.nom,
            stock: produit.stock
          };
        }
      })
    );
  
    Promise.all(verifications)
      .then(() => {
        this.commande.total = this.getTotal();
        this.commande.dateCommande = new Date();
        this.commande.lignesCommande = this.cartItems.map(item => ({
          produit: { id: item.id },
          quantite: item.quantity,
          prixUnitaire: item.price
        }));
        this.showCommandePopup = true;
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Stock insuffisant',
          html: `Le produit <strong>"${err.nom}"</strong> n'a que <strong>${err.stock}</strong> en stock.`,
          confirmButtonText: 'OK'
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  
  fermerPopup(): void {
    this.showCommandePopup = false;
  }

  // Envoie la commande au backend
  commander(): void {
    if (!this.commande.nom || !this.commande.prenom || !this.commande.adresse || !this.commande.telephone) {
      Swal.fire({
        icon: 'warning',
        title: 'Informations manquantes',
        text: 'Merci de remplir toutes les informations de livraison.',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.isLoading = true;
    this.commandeService.passerCommande(this.commande).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Commande validée',
          text: 'Votre commande a été passée avec succès !',
          confirmButtonText: 'OK'
        }).then(() => {
          this.cartService.clearCart();
          this.fermerPopup();
          this.router.navigate(['/shop']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors du passage de la commande.',
        });
        console.error('Erreur lors de la commande :', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Supprimer un produit du panier
  removeFromCart(productId: number): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir retirer ce produit de votre panier ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(productId);
      }
    });
  }

  applyPromo(): void {
    const promoUpperCase = this.promoCode.trim().toUpperCase();
    
    if (promoUpperCase === 'SAVE10') {
      this.discount = this.getSubtotal() * 0.1; // 10% de réduction
      Swal.fire({
        icon: 'success',
        title: 'Code promo appliqué',
        text: 'Une réduction de 10% a été appliquée à votre commande !',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      this.discount = 0;
      Swal.fire({
        icon: 'error',
        title: 'Code promo invalide',
        text: 'Le code promo saisi n\'est pas valide.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotal(): number {
    return this.getSubtotal() - this.discount;
  }


  
    
  
  
  
  
  
}