package tn.cloudcrafters.picloud.Repository.gestionboutique;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Review;

import java.util.List;
@Repository
public interface IReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduitId(Long produitId);
}
