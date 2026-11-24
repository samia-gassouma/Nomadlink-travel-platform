package tn.cloudcrafters.picloud.Service.gestionPack;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionPack.Facture;
import tn.cloudcrafters.picloud.Repository.gestionPack.IFactureRepository;

import java.util.List;

@Service
public class FactureService implements IFactureService {
    @Autowired
    private IFactureRepository factureRepository;

    @Override
    public Facture getFacture(long id) {
        return factureRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Facture not found with id: " + id));
    }

    @Override
    public List<Facture> getFactures() {
        return (List<Facture>) factureRepository.findAll();
    }

    @Override
    public List<Facture> getFacturesByUser(long id) {
        return factureRepository.findFacturesByUser_Id(id);
    }

    @Override
    public Facture addFacture(Facture facture) {
        return factureRepository.save(facture);
    }

    @Override
    public void deleteFacture(long id) {
        factureRepository.deleteById(id);
    }
}
