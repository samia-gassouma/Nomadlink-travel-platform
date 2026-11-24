package tn.cloudcrafters.picloud.Controller.gestionboutique;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Review;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IProduitRepository;
import tn.cloudcrafters.picloud.Service.gestionboutique.review.IReviewService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class ReviewController {
    private final IReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<?> submitReview(@RequestBody Review reviewDto) {
        try {
            Review review = new Review();
            review.setRating(reviewDto.getRating());
            review.setCommentaire(reviewDto.getCommentaire());
            review.setFullName(reviewDto.getFullName());
            review.setDate(LocalDateTime.now());

            // Créer le produit avec seulement l’ID
            Produit produit = new Produit();
            produit.setId(reviewDto.getProduit().getId());
            review.setProduit(produit);

            Review savedReview = reviewService.addReview(review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'ajout de la revue : " + e.getMessage());
        }
    }

    @GetMapping("/produit/{id}")
    public List<Review> getReviewsByProduit(@PathVariable Long id) {
        return reviewService.getReviewsByProduitId(id);
    }

    @PutMapping("/reviews/{id}/helpful")
    public ResponseEntity<Review> incrementHelpful(@PathVariable Long id) {
        try {
            // Appeler le service pour incrémenter le compteur helpful
            Review updatedReview = reviewService.incrementHelpfulCount(id);

            // Retourner la revue mise à jour
            return ResponseEntity.ok(updatedReview);
        } catch (RuntimeException e) {
            // Si l'avis n'est pas trouvé, retourner une réponse Not Found
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get/{id}")
    public List<Review> getReviewsByProductId(@PathVariable("id") Long produitId) {
        return reviewService.getReviewsByProductId(produitId);
    }
}
