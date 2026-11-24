package tn.cloudcrafters.picloud.Controller.gestionboutique;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Livraison;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;
import tn.cloudcrafters.picloud.Entity.gestionboutique.StatutLivraison;
import tn.cloudcrafters.picloud.Repository.gestionboutique.ICommandeRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.ILivraisonRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IProduitRepository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistiques")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class StatistiqueController {

    private final ICommandeRepository commandeRepo;
    private final IProduitRepository produitRepo;
    private final ILivraisonRepository livraisonRepo;

    @GetMapping("/global")
    public Map<String, Object> getGlobalStats() {
        Map<String, Object> result = new HashMap<>();


        List<Object[]> commandesParMois = commandeRepo.getCommandesParMois(); // Tu dois créer cette méthode personnalisée
        List<Map<String, Object>> commandesData = commandesParMois.stream().map(obj -> Map.of(
                "mois", obj[0],
                "total", obj[1]
        )).toList();

        result.put("commandes", Map.of("parMois", commandesData));


        Pageable pageable = PageRequest.of(0, 5);
        List<Produit> topProduits = produitRepo.findTop5ProduitsParCommandes(pageable);

        List<Map<String, Object>> topVentes = topProduits.stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("nom", p.getNom());
                    map.put("quantite", p.getNombreCommandes());
                    return map;
                })
                .collect(Collectors.toList());

        result.put("produits", Map.of(
                "topVentes", topVentes,
                "total", topProduits.size()
        ));



        List<Livraison> livraisons = livraisonRepo.findAll();
        long terminees = livraisons.stream().filter(l -> l.getStatut().equals(StatutLivraison.LIVREE)).count();
        long enCours = livraisons.stream().filter(l -> l.getStatut().equals(StatutLivraison.EN_COURS)).count();
        long annulees = livraisons.stream().filter(l -> l.getStatut().equals(StatutLivraison.ANNULEE)).count();
        long retard = livraisons.stream()
                .filter(l -> l.getDateEstimee().before(new Date()) && !l.getStatut().equals(StatutLivraison.LIVREE))
                .count();

        result.put("livraisons", Map.of(
                "terminees", terminees,
                "enCours", enCours,
                "annulees", annulees,
                "retard", retard
        ));

        return result;
    }
}