import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Review } from 'src/app/front-office/models/boutique/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = 'http://localhost:9000/picloud/api/reviews';

  constructor(private http: HttpClient) {}

  addReview(review: Review): Observable<Review> {
    if (!review.produit || !review.produit.id) {
      return throwError(() => new Error('ID du produit est requis'));
    }

    return this.http.post<Review>(`${this.baseUrl}/add`, review).pipe(
      catchError((error) => {
        let errorMessage = 'Erreur inconnue';
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error && error.message) {
          errorMessage = error.message;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getReviewsByProduit(produitId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/produit/${produitId}`);
  }

  incrementHelpfulCount(reviewId: number): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/reviews/${reviewId}/helpful`, {});
  }
  getReviewsByProductId(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/get/${productId}`);
  }
  
  
}
