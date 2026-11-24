import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  quantity: number;  
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: ProductItem[] = [];
  private cartSubject = new BehaviorSubject<ProductItem[]>([]);

  constructor() {
    // Charger le panier depuis le localStorage à l'initialisation
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
  }

  private updateCartState() {
    // Mettre à jour le localStorage et notifier les abonnés
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  getCart() {
    return this.cartSubject.asObservable();
  }

  addToCart(product: ProductItem) {
    const existingProduct = this.cart.find(p => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.cart.push(product);
    }

    this.updateCartState();
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(p => p.id !== productId);
    this.updateCartState();
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }
  updateCartItem(updatedItem: ProductItem): void {
    const index = this.cart.findIndex(p => p.id === updatedItem.id);
    if (index !== -1) {
      this.cart[index].quantity = updatedItem.quantity;
  
      // Si la quantité est 0 ou négative, on supprime l’item
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
  
      this.updateCartState();
    }
  }
  
  clearCart() {
    this.cart = [];
    this.updateCartState();
  }
}
