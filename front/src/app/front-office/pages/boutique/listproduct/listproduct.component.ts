import { Component } from '@angular/core';
import { ProduitService } from 'src/app/front-office/services/boutique/produit/produit.service';
import { Product } from 'src/app/front-office/models/boutique/product.model';
import { ImageProduit } from 'src/app/front-office/models/boutique/imageproduct.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { CartService , ProductItem} from 'src/app/front-office/services/boutique/cart/cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommandeService } from 'src/app/front-office/services/boutique/commande/commande.service';
import { Review } from 'src/app/front-office/models/boutique/review.model';
import { ReviewService } from 'src/app/front-office/services/boutique/review/review.service';


interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.scss'],
})
export class ListproductComponent {
  products: Product[] = [];
  page: number = 1;
  itemsPerPage: number = 2; 
  navMethod = false;
  windowScrolled = false;
  quantityByProductId: { [productId: number]: number } = {};
  sortOption = 'nameAsc';
  selectedCategoryId: number | null = null;
  filteredProducts: Product[] = [];
  expandedDescriptions: { [productId: number]: boolean } = {};
  pendingOrdersCount: number = 0; 
  averageRating: number = 0;
  categories: Category[] = [
    { id: 1, name: 'Électronique' },
    { id: 2, name: 'Vêtements' },
    { id: 3, name: 'Alimentation' },
    { id: 4, name: 'Maison' },
    { id: 5, name: 'Sport' }
  ];
  reviews: Review[] = [];
  filteredCategories: Category[] = [];
  reviewsByProductId: { [productId: number]: Review[] } = {};
  averageRatings: { [productId: number]: number } = {};
reviewCounts: { [productId: number]: number } = {};

  constructor(
    private cartService: CartService, 
    private productService: ProduitService,
    private orderService: CommandeService, 
    private reviewService: ReviewService,
    private router: Router
  ) {
    this.loadProducts();
    this.loadPendingOrders();
    
    // Ajout d'un écouteur pour le défilement de la fenêtre
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy() {
    // Suppression de l'écouteur quand le composant est détruit
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  /**
   * Charge le nombre de commandes en attente
   */
  loadPendingOrders() {
    this.orderService.getPendingOrders().subscribe(orders => {
      this.pendingOrdersCount = orders.length;
    });
  }

  /**
   * Obtient le nom de la catégorie à partir de son ID
   */
  getCategoryName(id: any): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : 'Inconnue';
  }

  /**
   * Augmente la quantité d'un produit
   */
  increaseQuantity(productId: number): void {
    if (!this.quantityByProductId[productId]) {
      this.quantityByProductId[productId] = 1;
    }
    this.quantityByProductId[productId]++;
  }

  /**
   * Diminue la quantité d'un produit
   */
  decreaseQuantity(productId: number): void {
    if (this.quantityByProductId[productId] > 1) {
      this.quantityByProductId[productId]--;
    }
  }

  /**
   * Change l'état d'expansion de la description d'un produit
   */
  toggleDescription(productId: number) {
    this.expandedDescriptions[productId] = !this.expandedDescriptions[productId];
  }

  /**
   * Vérifie si la description d'un produit est développée
   */
  isDescriptionExpanded(productId: number): boolean {
    return this.expandedDescriptions[productId] || false;
  }

  /**
   * Récupère toutes les URLs d'images pour un produit
   */
  getAllImageUrls(product: Product): string[] {
    if (product.images && product.images.length > 0) {
      return product.images.map((img: ImageProduit) => 'data:image/jpeg;base64,' + img.image);
    }
    return ['assets/images/no-image.png'];
  }

  /**
   * Change de page dans la pagination
   */
  onPageChange(pageNumber: number): void {
    this.setPage(pageNumber);
  }

  /**
   * Charge tous les produits depuis le service
   */
  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.products.forEach(p => {
        if (!this.quantityByProductId[p.id]) {
          this.quantityByProductId[p.id] = 1;
        }
      });
      this.products.forEach((product) => {
        this.loadReviewsForProducts();
      });
      const usedCategoryIds = [...new Set(data.map(p => Number(p.categorie)))];
      this.filteredCategories = this.categories.filter(cat => usedCategoryIds.includes(cat.id));
      this.filteredProducts = [...this.products];
      this.sortProducts();
    });
  }
  loadReviewsForProducts(): void {
    this.products.forEach(product => {
      this.reviewService.getReviewsByProductId(product.id).subscribe(reviews => {
        if (reviews && reviews.length > 0) {
          const total = reviews.reduce((sum, r) => sum + r.rating, 0);
          this.averageRatings[product.id] = total / reviews.length;
          this.reviewCounts[product.id] = reviews.length;
        } else {
          this.averageRatings[product.id] = 0;
          this.reviewCounts[product.id] = 0;
        }
      });
    });
  }
  
  getStarClass(productId: number, star: number): string {
    const avg = this.averageRatings[productId] || 0;
    if (star <= Math.floor(avg)) return 'active';
    if (star - 0.5 <= avg && star > Math.floor(avg)) return 'half';
    return '';
  }
  
  // Méthode pour calculer la note moyenne d'un produit
  getAverageRating(productId: number): number {
    const reviews = this.reviewsByProductId[productId];
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }

  // Méthode pour compter le nombre d'avis d'un produit
  getReviewCount(productId: number): number {
    return this.reviewsByProductId[productId]?.length || 0;
  }
  /**
   * Filtre les produits par catégorie
   */
  filterByCategory() {
    if (this.selectedCategoryId !== null) {
      this.filteredProducts = this.products.filter(p => Number(p.categorie) === this.selectedCategoryId);
    } else {
      this.filteredProducts = [...this.products];
    }
    this.page = 1; // Retourne à la première page après un filtrage
    this.sortProducts();
  }

  /**
   * Trie les produits selon l'option sélectionnée
   */
  sortProducts() {
    switch (this.sortOption) {
      case 'nameAsc':
        this.filteredProducts.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'nameDesc':
        this.filteredProducts.sort((a, b) => b.nom.localeCompare(a.nom));
        break;
      case 'priceAsc':
        this.filteredProducts.sort((a, b) => a.prix - b.prix);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a, b) => b.prix - a.prix);
        break;
    }
  }

  /**
   * Ajoute un produit au panier
   */
  addToCart(product: Product): void {
    const quantity = Number(this.quantityByProductId[product.id]) || 1;
    const image = this.getAllImageUrls(product)[0];
    const item: ProductItem = {
      id: product.id,
      name: product.nom,
      price: product.prix,
      quantity: quantity,
      image: image
    };

    this.cartService.addToCart(item);

    Swal.fire({
      title: 'Ajouté au panier !',
      text: `${item.name} x${item.quantity} a été ajouté au panier.`,
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  /**
   * Calcule le nombre total de pages
   */
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  /**
   * Change la page courante
   */
  setPage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  /**
   * Fait défiler la page vers le haut
   */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Gère l'événement de défilement de la fenêtre
   */
  onScroll(): void {
    this.windowScrolled = window.scrollY > 300;
  }
  
  /**
   * Déclenche le défilement vers le haut lors du clic sur le bouton
   */
  scrollToTopOnClick(): void {
    this.scrollToTop();  
  }

  /**
   * Redirige vers la page des commandes
   */
  openCommandes() {
    this.router.navigate(['/mes-commandes']);
  }
  
  /**
   * Gère l'affichage des numéros de page pour la pagination
   * Permet de centrer la page actuelle quand il y a beaucoup de pages
   */
  getPageNumberToShow(index: number): number {
    if (this.totalPages <= 5) {
      return index + 1;
    }
    
    // Logique pour afficher toujours 5 pages avec la page courante au milieu si possible
    if (this.page <= 3) {
      return index + 1;
    } else if (this.page >= this.totalPages - 2) {
      return this.totalPages - 4 + index;
    } else {
      return this.page - 2 + index;
    }
  }
}