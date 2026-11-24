package tn.cloudcrafters.picloud.Service.gestionboutique.livraison;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Commande;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Livraison;
import tn.cloudcrafters.picloud.Entity.gestionboutique.StatutLivraison;
import tn.cloudcrafters.picloud.Repository.gestionboutique.ICommandeRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.ILivraisonRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class LivraisonService implements ILivraisonService {
    @Autowired
    private final ILivraisonRepository livraisonRepository;
    @Autowired
    private final ICommandeRepository commandeRepository;
    @Override
    public Livraison creerLivraison(Livraison livraison) {
        if (livraison == null) {
            throw new IllegalArgumentException("La livraison ne peut pas être nulle.");
        }

        Commande commande;

        if (livraison.getCommande().getId() != null &&
                commandeRepository.existsById(livraison.getCommande().getId())) {

            // La commande existe → on la récupère
            commande = commandeRepository.findById(livraison.getCommande().getId()).get();
        } else {
            // La commande n'existe pas → on la sauvegarde
            commande = commandeRepository.save(livraison.getCommande());
        }

        livraison.setCommande(commande); // attacher une entité persistée
        return livraisonRepository.save(livraison);
    }




    @Override
    public Livraison mettreAJourLivraison(Livraison livraison) {
        Livraison existing = livraisonRepository.findById(livraison.getId())
                .orElseThrow(() -> new RuntimeException("Livraison introuvable avec ID : " + livraison.getId()));

        existing.setDateEstimee(livraison.getDateEstimee());
        existing.setDateLivraisonEffective(livraison.getDateLivraisonEffective());
        existing.setAdresseLivraison(livraison.getAdresseLivraison());
        existing.setStatut(livraison.getStatut());
        existing.setTransporteur(livraison.getTransporteur());

        return livraisonRepository.save(existing);
    }

    @Override
    public Optional<Livraison> getLivraisonById(Long id) {
        return livraisonRepository.findById(id);
    }

    @Override
    public Livraison getLivraisonByCommandeId(Long commandeId) {
        return livraisonRepository.findByCommandeId(commandeId);
    }

    @Override
    public List<Livraison> getAllLivraisons() {
        return livraisonRepository.findAll();
    }

    @Override
    public void supprimerLivraison(Long id) {
        livraisonRepository.deleteById(id);
    }

    @Override
    public List<Livraison> getLivraisonsEnCoursTriees() {
        return livraisonRepository.findByStatutOrderByDateEstimeeAsc(StatutLivraison.EN_COURS);
    }
    @Override
    public List<Livraison> getLivraisonsLivrees() {
        return livraisonRepository.findByStatut(StatutLivraison.LIVREE);
    }

}
