package tn.cloudcrafters.picloud.Entity.gestionboutique;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class LigneCommande implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "commande_id", nullable = false)
    @JsonBackReference(value = "commande-lignes")
    private Commande commande;

    @ManyToOne
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @Column(nullable = false)
    private int quantite;

    @Column(nullable = false)
    private double prixUnitaire; // Peut être utile si le prix du produit change plus tard

    public double getSousTotal() {
        return this.prixUnitaire * this.quantite;
    }
}
