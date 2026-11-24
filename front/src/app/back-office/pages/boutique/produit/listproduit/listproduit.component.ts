import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutsModule } from 'src/app/back-office/layouts/layouts.module';
import { Product } from 'src/app/front-office/models/boutique/product.model';
import { ProduitService } from 'src/app/front-office/services/boutique/produit/produit.service';

import Swal from 'sweetalert2';
import {ImageProduit} from "../../../../../front-office/models/boutique/imageproduct.model";

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-listproduit',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    LayoutsModule,
    RouterModule
  ],
  templateUrl: './listproduit.component.html',
  styleUrls: ['./listproduit.component.scss']
})
export class ListproduitComponent implements OnInit {
  isSidebarHidden: boolean = false;
  products: Product[] = [];
  selectedProduct: Product | null = null;

  categories: Category[] = [
    { id: 1, name: 'Électronique' },
    { id: 2, name: 'Vêtements' },
    { id: 3, name: 'Alimentation' },
    { id: 4, name: 'Maison' },
    { id: 5, name: 'Sport' }
  ];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  
  
  constructor(
    private productService: ProduitService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('[DEBUG] Produits récupérés ✅', this.products);
      },
      error: (err) => {
        console.error('[ERREUR] Échec de récupération des produits ❌', err);
      }
    });
  }

  getCategoryName(categoryKey: string): string {
    const category = this.categories.find(c => c.id.toString() === categoryKey);
    return category ? category.name : 'Inconnue';
  }



  getFirstImageUrl(product: Product): string {
    if (product.images && product.images.length > 0) {
      return 'data:image/jpeg;base64,' + product.images[0].image;
    }
    return 'assets/images/no-image.png';
  }

  getAllImageUrls(product: Product): string[] {
    if (product.images && product.images.length > 0) {
      return product.images.map((img: ImageProduit) => 'data:image/jpeg;base64,' + img.image);
    }
    return ['assets/images/no-image.png'];
  }
  openProductDetails(content: any, product: Product): void {
    this.selectedProduct = product;
    this.modalService.open(content, { size: 'lg', centered: true });
  }
  
  viewProduct(product: Product): void {
    Swal.fire({
      title: product.nom,
      html: `
        <strong>Catégorie:</strong> ${this.getCategoryName(product.categorie)}<br/>
        <strong>Prix:</strong> ${product.prix} TND<br/>
        <strong>Stock:</strong> ${product.stock}<br/>
        <strong>Description:</strong> ${product.description || 'Aucune description'}
      `,
      imageUrl: this.getFirstImageUrl(product),
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: product.nom,
      confirmButtonText: 'Fermer'
    });
  }

  updateProduct(productId: number): void {
    this.router.navigate(['/back-office/updateProduct', productId]);
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'Le produit a été supprimé.', 'success');
            this.loadProducts();
          },
          error: () => {
            Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
          }
        });
      }
    });
  }

  
  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.products.slice(start, end);
  }
  
  get totalPages(): number[] {
    return Array(Math.ceil(this.products.length / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }
  
  setPage(page: number) {
    this.currentPage = page;
  }
}
