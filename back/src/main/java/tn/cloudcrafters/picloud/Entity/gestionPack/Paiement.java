package tn.cloudcrafters.picloud.Entity.gestionPack;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.Reservation;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long montant;
    private String methode_paiement;
    private Date date_paiement;
    private String statut;
    private BigDecimal percent_off;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_reservation")
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonIgnoreProperties({"paiements","rewardPoints",})
    private User user;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnoreProperties("paiement")
    private Facture facture;

    @ManyToOne
    @JsonIgnoreProperties({"paiements","pricePlans","vol"})
    private Pack pack;


    @ManyToOne
    @JsonIgnoreProperties({"lignesCommande","images"})
    private Produit produit;
}
