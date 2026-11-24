package tn.cloudcrafters.picloud.Controller.gestionboutique;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.gestionboutique.ImageProduit;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;
import tn.cloudcrafters.picloud.Service.gestionboutique.produit.IProduitService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class ProduitController {

    private final IProduitService produitService;

    @GetMapping("/all")
    public List<Produit> getAllProduits() {
        return produitService.getAllProduits();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable Long id) {
        return produitService.getProduitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Produit> createProduit(
            @RequestPart("produit") String produitJson,
            @RequestPart("images") List<MultipartFile> images) {

        try {
            // Convertir le JSON en objet Produit
            ObjectMapper objectMapper = new ObjectMapper();
            Produit produit = objectMapper.readValue(produitJson, Produit.class);

            // Sauvegarder les images dans la base de données
            List<ImageProduit> imageProduits = new ArrayList<>();
            for (MultipartFile image : images) {
                // Convertir l'image en tableau de bytes
                byte[] imageData = image.getBytes();

                // Créer un objet ImageProduit et associer l'image et le produit
                ImageProduit imageProduit = new ImageProduit();
                imageProduit.setProduit(produit);  // Lier l'image au produit
                imageProduit.setImage(imageData);  // Sauvegarder l'image en BLOB
                imageProduits.add(imageProduit);
            }
            // Sauvegarder le produit et ses images dans la base de données
            produit.setImages(imageProduits);  // Associer les images au produit
            Produit savedProduit = produitService.createProduit(produit);

            // Retourner une réponse avec le produit créé
            return ResponseEntity.ok(savedProduit);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduit(
            @PathVariable Long id,
            @RequestPart("produit") String produitJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Produit produit = mapper.readValue(produitJson, Produit.class);

            produitService.updateProduit(id, produit, images);
            return ResponseEntity.ok("Produit mis à jour avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour");
        }
    }





    @DeleteMapping("/delete/{id}")
    public void deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Produit>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(produitService.getProductsByCategory(categoryId));
    }

    @GetMapping("/disponibles")
    public List<Produit> getProduitsDisponibles() {
        return produitService.getProduitsDisponibles();
    }

    @PostMapping("/reduire-stock")
    public void reduireStock(@RequestParam Long produitId, @RequestParam int quantite) {
        produitService.reduireStockProduit(produitId, quantite);
    }

    @GetMapping("/search")
    public List<Produit> searchProduits(@RequestParam String keyword) {
        return produitService.searchProduits(keyword);
    }

    @GetMapping("/prix")
    public List<Produit> getProduitsByPrixBetween(@RequestParam double min, @RequestParam double max) {
        return produitService.getProduitsByPrixBetween(min, max);
    }

    @GetMapping("/rupture")
    public List<Produit> getProduitsEnRuptureDeStock() {
        return produitService.getProduitsEnRuptureDeStock();
    }
}