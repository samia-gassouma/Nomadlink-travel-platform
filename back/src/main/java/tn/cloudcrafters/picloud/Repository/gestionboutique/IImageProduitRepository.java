package tn.cloudcrafters.picloud.Repository.gestionboutique;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.cloudcrafters.picloud.Entity.gestionboutique.ImageProduit;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;

import java.util.List;

public interface IImageProduitRepository extends JpaRepository<ImageProduit, Long> {
    List<ImageProduit> findByProduitId(Long produitId);
    void deleteByProduit(Produit produit);
}
