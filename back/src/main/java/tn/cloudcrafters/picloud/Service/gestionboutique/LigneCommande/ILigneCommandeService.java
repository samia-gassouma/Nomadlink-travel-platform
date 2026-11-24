package tn.cloudcrafters.picloud.Service.gestionboutique.LigneCommande;



import tn.cloudcrafters.picloud.Entity.gestionboutique.LigneCommande;

import java.util.List;
import java.util.Optional;

public interface ILigneCommandeService {
    LigneCommande createLigneCommande(LigneCommande ligneCommande);
    List<LigneCommande> getAllLignesCommande();
    Optional<LigneCommande> getLigneCommandeById(Long id);
    void deleteLigneCommande(Long id);
}
