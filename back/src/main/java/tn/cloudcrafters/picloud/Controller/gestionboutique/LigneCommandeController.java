package tn.cloudcrafters.picloud.Controller.gestionboutique;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionboutique.LigneCommande;
import tn.cloudcrafters.picloud.Service.gestionboutique.LigneCommande.ILigneCommandeService;

import java.util.List;

@RestController
@RequestMapping("/api/lignes-commandes")
@RequiredArgsConstructor
public class LigneCommandeController {

    private final ILigneCommandeService ligneCommandeService;

    @PostMapping
    public ResponseEntity<LigneCommande> create(@RequestBody LigneCommande ligneCommande) {
        return ResponseEntity.ok(ligneCommandeService.createLigneCommande(ligneCommande));
    }

    @GetMapping
    public List<LigneCommande> getAll() {
        return ligneCommandeService.getAllLignesCommande();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LigneCommande> getById(@PathVariable Long id) {
        return ligneCommandeService.getLigneCommandeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ligneCommandeService.deleteLigneCommande(id);
        return ResponseEntity.noContent().build();
    }
}
