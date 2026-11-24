package tn.cloudcrafters.picloud.Controller.gestionboutique;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Livraison;
import tn.cloudcrafters.picloud.Service.gestionboutique.livraison.ILivraisonService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

;

@RestController
@RequestMapping("/api/livraisons")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class LivraisonController {

    private final ILivraisonService livraisonService;

    @PostMapping("/create")
    public ResponseEntity<Livraison> createLivraison(@RequestBody Livraison livraison) {
        Livraison created = livraisonService.creerLivraison(livraison);
        return ResponseEntity.ok(created);
    }
    @GetMapping("/en-cours")
    public ResponseEntity<List<Livraison>> getLivraisonsEnCours() {
        List<Livraison> livraisons = livraisonService.getLivraisonsEnCoursTriees();
        return ResponseEntity.ok(livraisons);
    }

    // Mettre à jour les informations d'une livraison (y compris la date effective de livraison)
    @PutMapping("/{id}")
    public ResponseEntity<Livraison> mettreAJourLivraison(@PathVariable Long id, @RequestBody Livraison livraison) {
        livraison.setId(id); // Assurer que l'id dans l'objet de livraison soit bien le même que celui du PathVariable
        Livraison updatedLivraison = livraisonService.mettreAJourLivraison(livraison);
        return ResponseEntity.ok(updatedLivraison);
    }

    @PutMapping(value = "/date-effective/{id}", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<Livraison> mettreAJourDateEffective(@PathVariable Long id, @RequestBody String dateLivraisonEffective) {
        Livraison livraison = livraisonService.getLivraisonById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livraison non trouvée avec l'ID: " + id));

        try {
            Date date = new SimpleDateFormat("yyyy-MM-dd").parse(dateLivraisonEffective);
            livraison.setDateLivraisonEffective(date);
            Livraison updatedLivraison = livraisonService.mettreAJourLivraison(livraison);
            return ResponseEntity.ok(updatedLivraison);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/livrees")
    public ResponseEntity<List<Livraison>> getLivraisonsLivrees() {
        List<Livraison> livrees = livraisonService.getLivraisonsLivrees();
        return ResponseEntity.ok(livrees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livraison> getLivraisonById(@PathVariable Long id) {
        return livraisonService.getLivraisonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/commande/{commandeId}")
    public ResponseEntity<Livraison> getLivraisonByCommandeId(@PathVariable Long commandeId) {
        return ResponseEntity.ok(livraisonService.getLivraisonByCommandeId(commandeId));
    }

    @GetMapping
    public ResponseEntity<List<Livraison>> getAllLivraisons() {
        return ResponseEntity.ok(livraisonService.getAllLivraisons());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerLivraison(@PathVariable Long id) {
        livraisonService.supprimerLivraison(id);
        return ResponseEntity.noContent().build();
    }
}
