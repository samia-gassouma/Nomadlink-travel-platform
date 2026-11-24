package tn.cloudcrafters.picloud.Service.gestionboutique.livraison;



import tn.cloudcrafters.picloud.Entity.gestionboutique.Livraison;

import java.util.List;
import java.util.Optional;

public interface ILivraisonService {
    Livraison creerLivraison(Livraison livraison);
    Livraison mettreAJourLivraison(Livraison livraison);
    Optional<Livraison> getLivraisonById(Long id);
    Livraison getLivraisonByCommandeId(Long commandeId);
    List<Livraison> getAllLivraisons();
    void supprimerLivraison(Long id);
    List<Livraison> getLivraisonsEnCoursTriees();
    List<Livraison> getLivraisonsLivrees();
}
