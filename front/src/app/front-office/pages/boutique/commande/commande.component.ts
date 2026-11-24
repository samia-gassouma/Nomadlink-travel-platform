import { Component, OnInit } from '@angular/core';

import { CommandeService } from 'src/app/front-office/services/boutique/commande/commande.service';
import {Commande} from "../../../models/boutique/commande.model";
import {ImageProduit} from "../../../models/boutique/imageproduct.model";

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {
  commandes: Commande[] = [];
  selectedTab: 'encours' | 'historique' = 'encours';
  activeSlides: { [key: string]: number } = {}; // Pour suivre l'image active de chaque produit

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes() {
    this.commandeService.getCommandes().subscribe({
      next: data => {
        this.commandes = data;
        // Initialiser l'index actif pour chaque produit
        this.commandes.forEach(commande => {
          commande.lignesCommande.forEach(ligne => {
            const produitId = ligne.produit.id;
            this.activeSlides[produitId] = 0;
          });
        });
      },
      error: err => console.error(err)
    });
  }

  get commandesEnCours(): Commande[] {
    return this.commandes.filter(c => c.statut !== 'LIVREE' && c.statut !== 'ANNULEE');
  }

  get commandesHistoriques(): Commande[] {
    return this.commandes.filter(c => c.statut === 'LIVREE' || c.statut === 'ANNULEE');
  }

  selectTab(tab: 'encours' | 'historique'): void {
    this.selectedTab = tab;
  }

  getAllImageUrls(product: any): string[] {
    if (product.images && product.images.length > 0) {
      return product.images.map((img: ImageProduit) => 'data:image/jpeg;base64,' + img.image);
    }
    return ['assets/images/no-image.png'];
  }

  // Méthodes pour le carousel
  nextSlide(produitId: number): void {
    const images = this.getProductById(produitId)?.images || [];
    if (images.length > 1) {
      this.activeSlides[produitId] = (this.activeSlides[produitId] + 1) % images.length;
    }
  }

  prevSlide(produitId: number): void {
    const images = this.getProductById(produitId)?.images || [];
    if (images.length > 1) {
      this.activeSlides[produitId] = (this.activeSlides[produitId] - 1 + images.length) % images.length;
    }
  }

  getProductById(id: number): any {
    let foundProduct = null;
    this.commandes.forEach(commande => {
      commande.lignesCommande.forEach(ligne => {
        if (ligne.produit.id === id) {
          foundProduct = ligne.produit;
        }
      });
    });
    return foundProduct;
  }

  // Vérifier si un produit a plusieurs images
  hasMultipleImages(product: any): boolean {
    return product.images && product.images.length > 1;
  }

  // Nouvelles méthodes pour la gestion des statuts et des styles
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'VALIDEE': 'status-validated',
      'EN_PREPARATION': 'status-preparing',
      'EXPEDIEE': 'status-shipped',
      'LIVREE': 'status-delivered',
      'ANNULEE': 'status-cancelled'
    };
    return statusMap[status] || '';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'VALIDEE': 'fas fa-check-circle',
      'EN_PREPARATION': 'fas fa-box-open',
      'EXPEDIEE': 'fas fa-shipping-fast',
      'LIVREE': 'fas fa-home',
      'ANNULEE': 'fas fa-times-circle'
    };
    return iconMap[status] || 'fas fa-question-circle';
  }

  // Vérifier si une commande est active (ni livrée ni annulée)
  isActiveOrder(status: string): boolean {
    return status !== 'LIVREE' && status !== 'ANNULEE';
  }

  // Vérifier si une étape est active ou complétée
  isStepActive(currentStatus: string, stepStatus: string): boolean {
    const statusOrder = ['VALIDEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    return currentIndex >= stepIndex;
  }

  // Calculer le total d'une commande
  calculateTotal(commande: Commande): number {
    return commande.lignesCommande.reduce((total, ligne) => {
      return total + (ligne.prixUnitaire * ligne.quantite);
    }, 0);
  }
}