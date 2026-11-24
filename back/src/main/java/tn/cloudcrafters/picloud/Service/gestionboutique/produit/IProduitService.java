package tn.cloudcrafters.picloud.Service.gestionboutique.produit;

import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IProduitService {

    // CRUD Operations
    Produit createProduit(Produit produit);
    List<Produit> getAllProduits();
    Optional<Produit> getProduitById(Long id);
    //Produit updateProduit(Long id, Produit produitDetails);
    void deleteProduit(Long id);

    // Business Methods

    List<Produit> getProduitsDisponibles();
    void reduireStockProduit(Long produitId, int quantite);
    List<Produit> searchProduits(String keyword);
    List<Produit> getProduitsByPrixBetween(double minPrix, double maxPrix);
    List<Produit> getProduitsEnRuptureDeStock();

    Produit updateProduit(Long id, Produit updatedProduit, List<MultipartFile> images) throws IOException;
    public List<Produit> getProductsByCategory(Long categoryId);
}
