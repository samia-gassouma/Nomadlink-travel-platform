package tn.cloudcrafters.picloud.Controller.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.Facture;
import tn.cloudcrafters.picloud.Service.gestionPack.FactureService;

import java.util.List;

@RestController
public class FactureController {
    @Autowired
    private FactureService factureService;

    @GetMapping("/getFacture/{id}")
    public Facture getFacture(@PathVariable long id){
        return factureService.getFacture(id);
    }

    @GetMapping("/getAllFacture")
    public List<Facture> getFactures(){
        return factureService.getFactures();
    }

    @PostMapping("/addFacture")
    public Facture addFacture(@RequestBody Facture facture){
        return factureService.addFacture(facture);
    }

    @GetMapping("getFactureByUser/{id}")
    public List<Facture> getFactureByUser(@PathVariable long id){
        return factureService.getFacturesByUser(id);
    }

    @DeleteMapping("deleteMapping/{id}")
    public void deleteFacture(@PathVariable long id){
        factureService.deleteFacture(id);
    }
}
