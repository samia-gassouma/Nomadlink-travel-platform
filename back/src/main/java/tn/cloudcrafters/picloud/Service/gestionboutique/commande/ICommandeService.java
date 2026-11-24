package tn.cloudcrafters.picloud.Service.gestionboutique.commande;


import tn.cloudcrafters.picloud.Entity.gestionboutique.Commande;

import java.util.List;
import java.util.Optional;

public interface ICommandeService {
    Commande createCommande(Commande commande);
    List<Commande> getAllCommandes();
    Optional<Commande> getCommandeById(Long id);
    void deleteCommande(Long id);
    Commande updateCommande(Commande commande);
    public List<Commande> getCommandesSansLivraison();
}
