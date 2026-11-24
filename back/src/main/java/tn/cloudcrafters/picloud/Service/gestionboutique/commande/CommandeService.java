package tn.cloudcrafters.picloud.Service.gestionboutique.commande;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Commande;
import tn.cloudcrafters.picloud.Entity.gestionboutique.LigneCommande;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;
import tn.cloudcrafters.picloud.Repository.gestionboutique.ICommandeRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.ILigneCommandeRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IProduitRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CommandeService implements ICommandeService {

    private final ICommandeRepository commandeRepository;
    private final ILigneCommandeRepository ligneCommandeRepository;
    private final IProduitRepository produitRepository;

    @Override
    public Commande createCommande(Commande commande) {
        commande.setDateCommande(new Date());

        double total = 0;
        for (LigneCommande ligne : commande.getLignesCommande()) {
            Produit produit = produitRepository.findById(ligne.getProduit().getId())
                    .orElseThrow(() -> new RuntimeException("Produit introuvable ID: " + ligne.getProduit().getId()));

            if (produit.getStock() < ligne.getQuantite()) {
                throw new IllegalStateException("Stock insuffisant pour le produit: " + produit.getNom());
            }

            produit.reduireStock(ligne.getQuantite());
            produitRepository.save(produit);

            ligne.setCommande(commande);
            ligne.setPrixUnitaire(produit.getPrix());
            total += ligne.getSousTotal();
        }

        commande.setTotal(total);
        return commandeRepository.save(commande);
    }



    @Override
    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }
    @Override
    public Commande updateCommande(Commande updatedCommande) {
        Commande existingCommande = commandeRepository.findById(updatedCommande.getId())
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec ID : " + updatedCommande.getId()));

        // ✅ Mise à jour des champs autorisés
        existingCommande.setStatut(updatedCommande.getStatut());

        // Tu peux ajouter d'autres champs à mettre à jour ici si nécessaire

        return commandeRepository.save(existingCommande);
    }

    @Override
    public Optional<Commande> getCommandeById(Long id) {
        return commandeRepository.findById(id);
    }

    @Override
    public void deleteCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec ID : " + id));

        ligneCommandeRepository.deleteAll(commande.getLignesCommande());
        commandeRepository.deleteById(id);
    }
    @Override
    public List<Commande> getCommandesSansLivraison() {
        return commandeRepository.findCommandesSansLivraison();
    }

}
