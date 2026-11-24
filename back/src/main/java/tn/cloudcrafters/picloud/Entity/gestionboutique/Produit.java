package tn.cloudcrafters.picloud.Entity.gestionboutique;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.FieldDefaults;
import tn.cloudcrafters.picloud.Entity.gestionPack.Paiement;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Produit implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false)
    @Min(0)
    private double prix;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageProduit> images = new ArrayList<>();
    @JsonIgnore
    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneCommande> lignesCommande = new ArrayList<>();



    @Column(nullable = false)
    @PositiveOrZero
    private Integer stock;

    @Column(length = 50, nullable = false)
    private Long categorie;

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Review> reviews = new ArrayList<>();


    // Constructeur sans les images (elles seront ajoutées ensuite)
    public Produit(String nom, double prix, String description, Integer stock, Long categorie) {
        this.nom = nom;
        this.prix = prix;
        this.description = description;
        this.stock = stock;
        this.categorie = categorie;
    }

    // Méthode métier
    public boolean estDisponible() {
        return this.stock > 0;
    }

    // Méthode pour réduire le stock
    public void reduireStock(int quantite) {
        if (quantite > this.stock) {
            throw new IllegalStateException("Stock insuffisant");
        }
        this.stock -= quantite;
    }

    public List<String> getImageBase64() {
        List<String> base64Images = new ArrayList<>();
        for (ImageProduit imageProduit : this.images) {
            String base64Image = Base64.getEncoder().encodeToString(imageProduit.getImage());
            base64Images.add("data:image/jpeg;base64," + base64Image);
        }
        return base64Images;
    }
    public int getNombreCommandes() {
        if (lignesCommande == null) return 0;
        return (int) lignesCommande.stream()
                .map(lc -> lc.getCommande().getId()) // id de chaque commande
                .distinct()
                .count();
    }


    @OneToMany(mappedBy = "produit")
    private Set<Paiement> paiements;
}
