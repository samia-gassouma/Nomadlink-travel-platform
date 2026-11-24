import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: Date;
  helpfulCount?: number;
}

@Component({
  selector: 'app-product-reviews',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ 
        height: '*',
        opacity: 1
      })),
      state('out', style({ 
        height: '0px',
        opacity: 0
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ReviewComponent implements OnInit {
  @Input() product: any;
  
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  averageRating: number = 0;
  showReviewForm: boolean = false;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  
  reviewForm: FormGroup;
  selectedRating: number = 0;
  hoveredRating: number = -1;
  
  activeStarFilter: number = 0; // 0 means no filter

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating: [null, Validators.required],
      reviewerName: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    // Simulate API call with timeout
    setTimeout(() => {
      // Sample data - in real app this would come from a service
      this.reviews = [
        {
          id: '1',
          productId: this.product?.id || '1',
          reviewerName: 'Marie Dupont',
          rating: 5,
          comment: 'Excellent produit! Je suis très satisfaite de mon achat. La qualité est au rendez-vous et le rapport qualité-prix est imbattable.',
          date: new Date(2023, 9, 15),
          helpfulCount: 8
        },
        {
          id: '2',
          productId: this.product?.id || '1',
          reviewerName: 'Pierre Martin',
          rating: 4,
          comment: 'Très bon produit dans l\'ensemble. Seul bémol : la livraison a pris plus de temps que prévu.',
          date: new Date(2023, 8, 22),
          helpfulCount: 3
        },
        {
          id: '3',
          productId: this.product?.id || '1',
          reviewerName: 'Sophie Bernard',
          rating: 3,
          comment: 'Produit correct mais pas extraordinaire. Il y a mieux sur le marché pour ce prix.',
          date: new Date(2023, 7, 5)
        }
      ];
      
      this.calculateAverageRating();
      this.filteredReviews = [...this.reviews];
      this.isLoading = false;
    }, 1000);
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
    switch(rating) {
      case 1: return 'Très déçu';
      case 2: return 'Déçu';
      case 3: return 'Correct';
      case 4: return 'Satisfait';
      case 5: return 'Très satisfait';
      default: return '';
    }
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    // Create new review object
    const newReview: Review = {
      id: `review-${Date.now()}`,
      productId: this.product?.id || '1',
      reviewerName: this.reviewForm.value.reviewerName,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      date: new Date()
    };
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Add to beginning of reviews array
      this.reviews.unshift(newReview);
      this.calculateAverageRating();
      
      // Apply current filter
      this.filterByRating(this.activeStarFilter);
      
      // Reset form and close
      this.resetForm();
      this.toggleReviewForm();
      this.isSubmitting = false;
    }, 1500);
  }

  filterByRating(stars: number): void {
    this.activeStarFilter = stars;
    
    if (stars === 0) {
      this.filteredReviews = [...this.reviews];
    } else {
      this.filteredReviews = this.reviews.filter(review => review.rating === stars);
    }
  }

  resetFilter(): void {
    this.filterByRating(0);
  }

  sortReviews(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    switch(value) {
      case 'newest':
        this.filteredReviews.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'oldest':
        this.filteredReviews.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'highest':
        this.filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        this.filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
    }
  }

  markHelpful(reviewId: string): void {
    const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
      if (!this.reviews[reviewIndex].helpfulCount) {
        this.reviews[reviewIndex].helpfulCount = 1;
      } else {
        this.reviews[reviewIndex].helpfulCount!++;
      }
      
      // Update filtered reviews as well
      const filteredIndex = this.filteredReviews.findIndex(r => r.id === reviewId);
      if (filteredIndex !== -1) {
        this.filteredReviews[filteredIndex].helpfulCount = this.reviews[reviewIndex].helpfulCount;
      }
    }
  }
}