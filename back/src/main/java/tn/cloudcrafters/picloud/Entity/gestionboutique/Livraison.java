package tn.cloudcrafters.picloud.Entity.gestionboutique;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Livraison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "commande_id", unique = true)
    @JsonBackReference
    private Commande commande;

    @Temporal(TemporalType.DATE)
    private Date dateEstimee;

    @Temporal(TemporalType.DATE)
    private Date dateLivraisonEffective;

    @Column(length = 255)
    private String adresseLivraison;

    @Enumerated(EnumType.STRING)
    private StatutLivraison statut = StatutLivraison.EN_ATTENTE;

    @Column(length = 100)
    private String transporteur; // optionnel

    private int quantiteLivree;
}
