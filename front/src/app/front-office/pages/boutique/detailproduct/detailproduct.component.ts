import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/front-office/models/boutique/product.model';
import { Review } from 'src/app/front-office/models/boutique/review.model';
import { ProduitService } from 'src/app/front-office/services/boutique/produit/produit.service';
import { CartService } from 'src/app/front-office/services/boutique/cart/cart.service';
import { ReviewService } from 'src/app/front-office/services/boutique/review/review.service';
import { CurrentuserService } from 'src/app/services/gestionUser/service_me/currentuser.service';
import { User } from 'src/app/services/gestionUser/models';

interface Category {
  id: number;
  name: string;
}
@Component({
  selector: 'app-detailproduct',
  templateUrl: './detailproduct.component.html',
  styleUrls: ['./detailproduct.component.scss','./../review/review.component.scss'],
})
export class DetailproductComponent implements OnInit {
  @ViewChild('carousel') carousel!: NgbCarousel;

  categories: Category[] = [
    { id: 1, name: 'Électronique' },
    { id: 2, name: 'Vêtements' },
    { id: 3, name: 'Alimentation' },
    { id: 4, name: 'Maison' },
    { id: 5, name: 'Sport' }
  ];

  product!: Product;
  relatedProducts: Product[] = [];
  quantity: number = 1;
  currentSlideIndex: number = 0;
  isInWishlist: boolean = false;

  // Modal image
  showImageModal: boolean = false;
  selectedModalImage: string = '';

  // Reviews
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  averageRating: number = 0;
  showReviewForm: boolean = false;
  reviewForm: FormGroup;
  selectedRating: number = 0;
  hoveredRating: number = -1;
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  activeStarFilter: number = 0;
 currentUser: User | null = null;
  constructor(
    private route: ActivatedRoute,
    private productService: ProduitService,
    private cartService: CartService,
    private reviewService: ReviewService,
     private currentuserService: CurrentuserService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [null, Validators.required],
      reviewerName: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadProduct();
    this.loadCurrentUser();
  }
  loadCurrentUser(): void {
    this.currentuserService.loadCurrentUser();
    this.currentuserService.getCurrentUser().subscribe((user: User | null) => {
      this.currentUser = user;
      if (user) {
        this.reviewForm.patchValue({
          reviewerName: `${user.firstname} ${user.lastname}` || 'Not provided'
        });
      }
    });
  }
  getCategoryName(id: any): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : 'Inconnue';
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(+productId).subscribe({
        next: (data) => {
          this.product = data;
          this.loadRelatedProducts();
          this.loadReviews();
        },
        error: (error) => {
          console.error('Erreur lors du chargement du produit:', error);
        }
      });
    }
  }

  loadRelatedProducts(): void {
    if (this.product && this.product.categorie) {
      this.productService.getProductsByCategory(this.product.categorie).subscribe({
        next: (data) => {
          this.relatedProducts = data.filter(p => p.id !== this.product.id).slice(0, 4);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des produits similaires:', error);
        }
      });
    }
  }

  getAllImageUrls(): string[] {
    return this.product?.images?.length > 0
      ? this.product.images.map(img => 'data:image/jpeg;base64,' + img.image)
      : ['assets/images/no-image.png'];
  }

  getRelatedProductImage(product: Product): string {
    return product.images?.length > 0
      ? 'data:image/jpeg;base64,' + product.images[0].image
      : 'assets/images/no-image.png';
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    this.quantity = Math.floor(Math.max(1, this.quantity));
    if (this.product && this.quantity > this.product.stock) {
      this.quantity = this.product.stock;
    }
  }

  addToCart(product: Product): void {
    // Implementation as needed
  }

  openImageModal(img: string): void {
    this.selectedModalImage = img;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedModalImage = '';
  }

  shareOn(platform: string): void {
    if (!this.product) return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.product.nom);
    const description = encodeURIComponent(this.product.description || '');
    const imageUrl = this.getAllImageUrls()[0];

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title} - ${url}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${encodeURIComponent(imageUrl)}&description=${description}`;
        break;
      case 'instagram':
        alert("Le partage direct vers Instagram n'est pas supporté via navigateur. Merci de copier le lien manuellement.");
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Lien copié dans le presse-papiers !"))
      .catch(() => alert("Erreur lors de la copie du lien."));
  }

  loadReviews(): void {
    if (!this.product?.id) return;
  
    this.reviewService.getReviewsByProduit(this.product.id).subscribe({
      next: (data: Review[]) => {
        this.reviews = data;
        this.filteredReviews = [...this.reviews];
        this.calculateAverageRating();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis:', error);
        this.isLoading = false;
      }
    });
  }
  

  calculateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.reviewForm.reset();
    this.selectedRating = 0;
    this.hoveredRating = -1;
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating: rating });
  }

  getRatingText(rating: number): string {
    switch (rating) {
      case 1: return 'Très déçu';
      case 2: return 'Déçu';
      case 3: return 'Correct';
      case 4: return 'Satisfait';
      case 5: return 'Très satisfait';
      default: return '';
    }
  }

  
  
  
  submitReview(): void {
    // Vérifier que le formulaire est valide et que le produit est présent
    if (this.reviewForm.invalid || !this.product) {
      return;
    }
  
    this.isSubmitting = true;
  
    // Récupérer l'ID du produit depuis l'URL ou autre source
    const productId = this.route.snapshot.paramMap.get('id'); // Si vous récupérez l'ID du produit via les paramètres de l'URL
  
    if (productId && this.product) {
      const newReview: Review = {
        produit: { id: Number(productId) },  // Utilisation de l'ID du produit uniquement
        rating: this.reviewForm.value.rating,
        commentaire: this.reviewForm.value.comment,
        date: new Date(),
        fullName: this.reviewForm.value.reviewerName,  // Si un nom de reviewer est fourni
        helpfulCount: 0 // Valeur par défaut
      };
  
      console.log('Avis à soumettre :', newReview);
  
      // Envoi de l'avis via le service
      this.reviewService.addReview(newReview).subscribe({
        next: (savedReview) => {
          this.reviews.unshift(savedReview);  // Ajouter la revue en haut de la liste
          this.calculateAverageRating();  // Calculer la note moyenne après ajout
          this.filterByRating(this.activeStarFilter);
  
          // Réinitialiser le formulaire et masquer le formulaire d'avis
          this.resetForm();
          this.toggleReviewForm();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi de l\'avis :', error);
          this.isSubmitting = false;
        }
      });
    }
  }
  

  filterByRating(stars: number): void {
    this.activeStarFilter = stars;
    this.filteredReviews = stars === 0 ? [...this.reviews] : this.reviews.filter(r => r.rating === stars);
  }

  resetFilter(): void {
    this.filterByRating(0);
  }

  sortReviews(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filteredReviews.sort((a, b) => {
      switch (value) {
        case 'newest': return b.date.getTime() - a.date.getTime();
        case 'oldest': return a.date.getTime() - b.date.getTime();
        case 'highest': return b.rating - a.rating;
        case 'lowest': return a.rating - b.rating;
        default: return 0;
      }
    });
  }

  markHelpful(reviewId: number): void {
    this.reviewService.incrementHelpfulCount(reviewId).subscribe({
      next: (updatedReview) => {
        const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex !== -1) {
          this.reviews[reviewIndex].helpfulCount = updatedReview.helpfulCount;
        }
  
        const filteredIndex = this.filteredReviews.findIndex(r => r.id === reviewId);
        if (filteredIndex !== -1) {
          this.filteredReviews[filteredIndex].helpfulCount = updatedReview.helpfulCount;
        }
      },
      error: (error : any) => {
        console.error('Erreur lors du marquage comme utile :', error);
      }
    });
  }
  
}