package tn.cloudcrafters.picloud.Service.gestionPack;

import tn.cloudcrafters.picloud.Entity.gestionPack.Paiement;
import java.util.List;

public interface IPaiementService {
    Paiement getPaiement(long id);
    List<Paiement> getAllPaiement();
    List<Paiement> getPaiementByUserId(long userId);
    Paiement addPaiement(Paiement paiement);
    Paiement updatePaiement(Paiement paiement);
    void deletePaiement(long id);

}
