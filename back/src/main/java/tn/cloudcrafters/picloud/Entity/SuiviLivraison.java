package tn.cloudcrafters.picloud.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Livraison;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SuiviLivraison implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "livraison_id", referencedColumnName = "id")
    private Livraison livraison; // Relation ManyToOne avec Livraison

    private String statut; // Ex: "en transit", "livré", "retardé"

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateStatut;

    private String lieuActuel; // Lieu actuel de la livraison

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Livraison getLivraison() {
        return livraison;
    }

    public void setLivraison(Livraison livraison) {
        this.livraison = livraison;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Date getDateStatut() {
        return dateStatut;
    }

    public void setDateStatut(Date dateStatut) {
        this.dateStatut = dateStatut;
    }

    public String getLieuActuel() {
        return lieuActuel;
    }

    public void setLieuActuel(String lieuActuel) {
        this.lieuActuel = lieuActuel;
    }
}
