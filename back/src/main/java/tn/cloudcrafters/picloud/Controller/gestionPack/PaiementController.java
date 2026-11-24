package tn.cloudcrafters.picloud.Controller.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.Facture;
import tn.cloudcrafters.picloud.Entity.gestionPack.Paiement;
import tn.cloudcrafters.picloud.Service.gestionPack.PaiementService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class PaiementController {
    @Autowired
    private PaiementService paiementService;

    @GetMapping("/getPaiement/{id}")
    public Paiement getPaiement(@PathVariable long id){
        return paiementService.getPaiement(id);
    }

    @GetMapping("/getAllPaiement")
    public List<Paiement> getAllPaiement(){
        return paiementService.getAllPaiement();
    }

    @PostMapping("/addPaiement")
    public Paiement addPaiement(){
        Paiement p = new Paiement();
        Facture f = new Facture();
        f.setDate_emission(new Date());
        p.setMontant(122L);
        p.setFacture(f);
        return paiementService.addPaiement(p);
    }

    @GetMapping("/getPaiementByUser/{id}")
    public List<Paiement> getPaiementsByUserId(@PathVariable Long id) {
        return paiementService.getPaiementByUserId(id);
    }

    @PutMapping("/updatePaiement/{id}")
    public Paiement updatePaiement(@RequestBody Paiement paiement, @PathVariable long id){
        Optional<Paiement> p = Optional.ofNullable(paiementService.getPaiement(id));
        if (!p.isPresent()) {
            return null;
        }
        paiement.setId(id);
        return paiementService.updatePaiement(paiement);
    }

    @DeleteMapping("/deletePaiament/{id}")
    public void deletePaiement(@PathVariable long id){
        paiementService.deletePaiement(id);
    }
}
