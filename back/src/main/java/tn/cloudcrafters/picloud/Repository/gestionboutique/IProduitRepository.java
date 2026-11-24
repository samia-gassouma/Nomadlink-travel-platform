package tn.cloudcrafters.picloud.Repository.gestionboutique;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;

import java.util.List;

@Repository
public interface IProduitRepository extends JpaRepository<Produit, Long> {

    List<Produit> findByCategorie(Long categoryId);

    List<Produit> findByStockGreaterThan(int stock);

    List<Produit> findByStockEquals(int stock);

    List<Produit> findByPrixBetween(double minPrix, double maxPrix);

    List<Produit> findByNomContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String nom, String description);
    @Query("SELECT p FROM Produit p LEFT JOIN p.lignesCommande lc GROUP BY p ORDER BY COUNT(lc) DESC")
    List<Produit> findTop5ProduitsParCommandes(Pageable pageable);


    Produit getProduitsByNom(String nom);
}
