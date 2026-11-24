package tn.cloudcrafters.picloud.Service.gestionboutique.review;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Review;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IProduitRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IReviewRepository;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReviewService implements IReviewService {

    private final IReviewRepository reviewRepository;
    private final IProduitRepository produitRepository;



    @Override

    @Transactional
    public Review addReview(Review review) {
        if (review.getProduit() == null || review.getProduit().getId() == null) {
            throw new IllegalArgumentException("Produit ou ID du produit manquant dans la revue");
        }

        // Vérifie que le produit existe réellement en base
        Produit produit = produitRepository.findById(review.getProduit().getId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec ID : " + review.getProduit().getId()));

        review.setProduit(produit); // Réassure l’objet attaché
        return reviewRepository.save(review);
    }


    @Override
    public void updateReview(Long reviewId, String commentaire) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review introuvable"));
        review.setCommentaire(commentaire);
        reviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    @Override
    public List<Review> getReviewsByProduitId(Long produitId) {
        return reviewRepository.findByProduitId(produitId);
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    @Override
    public Optional<Review> findById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }
    @Override
    public Review incrementHelpfulCount(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review non trouvée"));

        // Incrémenter le compteur helpful
        review.setHelpfulCount(review.getHelpfulCount() + 1);

        // Sauvegarder la revue mise à jour
        return reviewRepository.save(review);
    }
    @Override
    public List<Review> getReviewsByProductId(Long produitId) {
        return reviewRepository.findByProduitId(produitId);
    }
}