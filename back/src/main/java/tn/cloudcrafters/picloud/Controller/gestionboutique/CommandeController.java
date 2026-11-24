package tn.cloudcrafters.picloud.Controller.gestionboutique;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Commande;
import tn.cloudcrafters.picloud.Service.gestionboutique.commande.ICommandeService;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class CommandeController {

    private final ICommandeService commandeService;

    @PostMapping("/create")
    public ResponseEntity<Commande> creerCommande(@RequestBody Commande commande){
        return ResponseEntity.ok(commandeService.createCommande(commande));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Commande> updateCommande(@PathVariable Long id, @RequestBody Commande commande) {
        commande.setId(id); // on s'assure que l'ID correspond
        return ResponseEntity.ok(commandeService.updateCommande(commande));
    }


    @GetMapping("/all")
    public List<Commande> getAll() {
        return commandeService.getAllCommandes();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Commande> getById(@PathVariable Long id) {
        return commandeService.getCommandeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commandeService.deleteCommande(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/commandes-sans-livraison")
    public ResponseEntity<List<Commande>> getCommandesSansLivraison() {
        List<Commande> commandes = commandeService.getCommandesSansLivraison();
        return ResponseEntity.ok(commandes);
    }

}
