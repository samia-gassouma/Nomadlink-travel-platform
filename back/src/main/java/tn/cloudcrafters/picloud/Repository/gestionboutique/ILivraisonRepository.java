package tn.cloudcrafters.picloud.Repository.gestionboutique;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Livraison;
import tn.cloudcrafters.picloud.Entity.gestionboutique.StatutLivraison;

import java.util.List;


@Repository
public interface ILivraisonRepository extends JpaRepository<Livraison, Long> {
    Livraison findByCommandeId(Long commandeId);
    List<Livraison> findByStatutOrderByDateEstimeeAsc(StatutLivraison statut);
    List<Livraison> findByStatut(StatutLivraison statut);

}
