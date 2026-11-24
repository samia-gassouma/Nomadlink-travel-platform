package tn.cloudcrafters.picloud.Repository.gestionboutique;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Commande;

import java.util.List;

@Repository
public interface ICommandeRepository extends JpaRepository<Commande, Long> {
    @Query("SELECT c FROM Commande c WHERE c.id NOT IN (SELECT l.commande.id FROM Livraison l)")
    List<Commande> findCommandesSansLivraison();
    @Query("SELECT MONTHNAME(c.dateCommande), COUNT(c.id) " +
            "FROM Commande c " +
            "GROUP BY MONTHNAME(c.dateCommande)")
    List<Object[]> getCommandesParMois();


}
