package tn.cloudcrafters.picloud.Service.gestionboutique.LigneCommande;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionboutique.LigneCommande;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;
import tn.cloudcrafters.picloud.Repository.gestionboutique.ILigneCommandeRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IProduitRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LigneCommandeService implements ILigneCommandeService {

    private final ILigneCommandeRepository ligneCommandeRepository;
    private final IProduitRepository produitRepository;

    @Override
    public LigneCommande createLigneCommande(LigneCommande ligneCommande) {
        Produit produit = produitRepository.findById(ligneCommande.getProduit().getId())
                .orElseThrow(() -> new RuntimeException("Produit introuvable ID: " + ligneCommande.getProduit().getId()));

        if (produit.getStock() < ligneCommande.getQuantite()) {
            throw new IllegalStateException("Stock insuffisant pour le produit : " + produit.getNom());
        }

        produit.reduireStock(ligneCommande.getQuantite());
        produitRepository.save(produit);

        ligneCommande.setPrixUnitaire(produit.getPrix());
        return ligneCommandeRepository.save(ligneCommande);
    }

    @Override
    public List<LigneCommande> getAllLignesCommande() {
        return ligneCommandeRepository.findAll();
    }

    @Override
    public Optional<LigneCommande> getLigneCommandeById(Long id) {
        return ligneCommandeRepository.findById(id);
    }

    @Override
    public void deleteLigneCommande(Long id) {
        ligneCommandeRepository.deleteById(id);
    }
}
