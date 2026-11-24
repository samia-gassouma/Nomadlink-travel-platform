package tn.cloudcrafters.picloud.Entity.gestionboutique;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;



    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public class LigneDeCommande implements Serializable {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Long id;

        int quantite;

        double prixUnitaire;

        @ManyToOne
        @JoinColumn(name = "produit_id")
        Produit produit;

        @ManyToOne
        @JoinColumn(name = "commande_id")
        Commande commande;

        public Commande getCommande() {
            return commande;
        }

        public void setCommande(Commande commande) {
            this.commande = commande;
        }

        public Produit getProduit() {
            return produit;
        }

        public void setProduit(Produit produit) {
            this.produit = produit;
        }

        public double getPrixUnitaire() {
            return prixUnitaire;
        }

        public void setPrixUnitaire(double prixUnitaire) {
            this.prixUnitaire = prixUnitaire;
        }

        public int getQuantite() {
            return quantite;
        }

        public void setQuantite(int quantite) {
            this.quantite = quantite;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }


