package tn.cloudcrafters.picloud.Service.gestionboutique.review;

import java.util.List;
import java.util.Optional;

import tn.cloudcrafters.picloud.Entity.gestionboutique.Review;


public interface IReviewService {
    Review addReview(Review review);
    List<Review> getReviewsByProduitId(Long produitId);
    List<Review> getAllReviews();
    void deleteReview(Long reviewId);
    void updateReview(Long reviewId, String commentaire);
    Optional<Review> findById(Long reviewId);
    Review incrementHelpfulCount(Long reviewId);
    List<Review> getReviewsByProductId(Long produitId);
}
