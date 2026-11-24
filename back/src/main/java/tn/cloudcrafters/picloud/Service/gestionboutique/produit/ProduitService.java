package tn.cloudcrafters.picloud.Service.gestionboutique.produit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.gestionboutique.ImageProduit;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IImageProduitRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IProduitRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProduitService implements IProduitService {
    @Autowired
    private final IProduitRepository produitRepository;
    @Autowired
    private final IImageProduitRepository imageProduitRepository;

    @Override
    public Produit createProduit(Produit produit) {
        // Sauvegarder le produit
        Produit savedProduit = produitRepository.save(produit);

        // Sauvegarder les images associées au produit
        for (ImageProduit imageProduit : produit.getImages()) {
            imageProduit.setProduit(savedProduit);  // Lier l'image au produit
            imageProduitRepository.save(imageProduit);  // Sauvegarder chaque image
        }

        return savedProduit;
    }

    @Override
    public List<Produit> getAllProduits() {
        List<Produit> produits = produitRepository.findAll();
        for (Produit produit : produits) {
            // Convertir les images en Base64
            produit.getImageBase64(); // Remplir la liste d'images Base64
        }
        return produits;
    }

    @Override
    public Optional<Produit> getProduitById(Long id) {
        return produitRepository.findById(id);
    }

    @Transactional
    public Produit updateProduit(Long id, Produit updatedProduit, List<MultipartFile> images) {
        Produit existingProduit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        // Mise à jour des champs de base
        existingProduit.setNom(updatedProduit.getNom());
        existingProduit.setDescription(updatedProduit.getDescription());
        existingProduit.setPrix(updatedProduit.getPrix());
        existingProduit.setStock(updatedProduit.getStock());
        existingProduit.setCategorie(updatedProduit.getCategorie());

        // Mise à jour des images si fournies
        if (images != null && !images.isEmpty()) {
            // Supprime les anciennes images (orphanRemoval gérera ça proprement)
            existingProduit.getImages().clear();

            for (MultipartFile file : images) {
                try {
                    ImageProduit image = new ImageProduit();
                    image.setImage(file.getBytes()); // stocké en BLOB
                    image.setProduit(existingProduit); // lien bidirectionnel requis
                    existingProduit.getImages().add(image);
                } catch (IOException e) {
                    throw new RuntimeException("Erreur lors de la lecture de l'image", e);
                }
            }
        }

        return produitRepository.save(existingProduit);
    }

    @Override
    public void deleteProduit(Long id) {
        produitRepository.deleteById(id);
    }


    @Override
    public List<Produit> getProductsByCategory(Long categoryId) {
        return produitRepository.findByCategorie(categoryId);
    }

    @Override
    public List<Produit> getProduitsDisponibles() {
        return produitRepository.findByStockGreaterThan(0);
    }

    @Override
    public void reduireStockProduit(Long produitId, int quantite) {
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
        produit.reduireStock(quantite);
        produitRepository.save(produit);
    }

    @Override
    public List<Produit> searchProduits(String keyword) {
        return produitRepository.findByNomContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    @Override
    public List<Produit> getProduitsByPrixBetween(double minPrix, double maxPrix) {
        return produitRepository.findByPrixBetween(minPrix, maxPrix);
    }

    @Override
    public List<Produit> getProduitsEnRuptureDeStock() {
        return produitRepository.findByStockEquals(0);
    }

    public Produit getProduitByName(String name){
        return produitRepository.getProduitsByNom(name);

    }
}
