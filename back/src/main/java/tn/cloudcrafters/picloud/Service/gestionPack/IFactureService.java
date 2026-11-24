package tn.cloudcrafters.picloud.Service.gestionPack;

import tn.cloudcrafters.picloud.Entity.gestionPack.Facture;

import java.util.List;

public interface IFactureService {
    Facture getFacture(long id);
    List<Facture> getFactures();
    List<Facture> getFacturesByUser(long id);
    Facture addFacture(Facture facture);
    void deleteFacture(long id);
}
