package tn.cloudcrafters.picloud.Entity.gestionboutique;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Commande implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date dateCommande;

    @Column(nullable = false)
    private double total;

    // Infos du client
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;



    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutLigneCommande statut = StatutLigneCommande.EN_ATTENTE;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "commande-lignes")
    private List<LigneCommande> lignesCommande = new ArrayList<>();

    @OneToOne(mappedBy = "commande", cascade = CascadeType.ALL)
    @JsonBackReference
    private Livraison livraison;




}
