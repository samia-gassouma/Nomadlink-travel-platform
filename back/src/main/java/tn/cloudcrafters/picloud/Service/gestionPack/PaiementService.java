package tn.cloudcrafters.picloud.Service.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionPack.Paiement;
import tn.cloudcrafters.picloud.Repository.gestionPack.IPaiementRepository;

import java.util.List;

@Service
public class PaiementService  implements IPaiementService{
    @Autowired
    private IPaiementRepository paiementRepository;


    @Override
    public Paiement getPaiement(long id) {
        return paiementRepository.findById(id).get();
    }

    @Override
    public List<Paiement> getAllPaiement() {
        return (List<Paiement>) paiementRepository.findAll();
    }

    @Override
    public List<Paiement> getPaiementByUserId(long userId) {
        return paiementRepository.findPaiementByUser_Id(userId);
    }

    @Override
    public Paiement addPaiement(Paiement paiement) {
        return paiementRepository.save(paiement);
    }

    @Override
    public Paiement updatePaiement(Paiement paiement) {
        return paiementRepository.save(paiement);
    }

    @Override
    public void deletePaiement(long id) {
        paiementRepository.deleteById(id);
    }

}
