package tn.cloudcrafters.picloud.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "vols")
public class Vol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVol;

    private String compagnie;
    private String numeroVol;
    private String aeroportDepart;
    private String aeroportArrivee;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime dateDepart;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime dateArrivee;
    private Integer dureeVol;
    private String typeAvion;
    private Double prix;
    private Integer siegesDisponibles;

    @Enumerated(EnumType.STRING)
    private Classe classe;

    @Setter
    @Enumerated(EnumType.STRING)
    private StatutVol statut;

    private String bagagesAutorises;

    // Ajout du champ pour l'URL de l'image
    private String imageUrl; // Ce champ va contenir l'URL de l'image

    @OneToMany(mappedBy = "vol", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Reservation> reservations; // Relation inchangée

    public enum Classe { Économie, Business, Première }
    public enum StatutVol { Programmé, Retardé, Annulé }
    //Samia
    @OneToMany(mappedBy = "vol")
    @JsonIgnore
    private Set<Pack> pack;



    // Getters et setters pour imageUrl
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Reste des getters et setters inchangés
    public Integer getIdVol() { return idVol; }
    public void setIdVol(Integer idVol) { this.idVol = idVol; }
    public String getCompagnie() { return compagnie; }
    public void setCompagnie(String compagnie) { this.compagnie = compagnie; }
    public String getNumeroVol() { return numeroVol; }
    public void setNumeroVol(String numeroVol) { this.numeroVol = numeroVol; }
    public String getAeroportDepart() { return aeroportDepart; }
    public void setAeroportDepart(String aeroportDepart) { this.aeroportDepart = aeroportDepart; }
    public String getAeroportArrivee() { return aeroportArrivee; }
    public void setAeroportArrivee(String aeroportArrivee) { this.aeroportArrivee = aeroportArrivee; }
    public LocalDateTime getDateDepart() { return dateDepart; }
    public void setDateDepart(LocalDateTime dateDepart) { this.dateDepart = dateDepart; }
    public LocalDateTime getDateArrivee() { return dateArrivee; }
    public void setDateArrivee(LocalDateTime dateArrivee) { this.dateArrivee = dateArrivee; }
    public Integer getDureeVol() { return dureeVol; }
    public void setDureeVol(Integer dureeVol) { this.dureeVol = dureeVol; }
    public String getTypeAvion() { return typeAvion; }
    public void setTypeAvion(String typeAvion) { this.typeAvion = typeAvion; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
    public Integer getSiegesDisponibles() { return siegesDisponibles; }
    public void setSiegesDisponibles(Integer siegesDisponibles) { this.siegesDisponibles = siegesDisponibles; }
    public Classe getClasse() { return classe; }
    public void setClasse(Classe classe) { this.classe = classe; }
    public StatutVol getStatut() { return statut; }
    public String getBagagesAutorises() { return bagagesAutorises; }
    public void setBagagesAutorises(String bagagesAutorises) { this.bagagesAutorises = bagagesAutorises; }
    public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }
    @Override
    public String toString() {
        return "Vol [numeroVol=" + numeroVol + ", compagnie=" + compagnie + ", aeroportDepart=" + aeroportDepart
                + ", aeroportArrivee=" + aeroportArrivee + ", dateDepart=" + dateDepart + ", dateArrivee=" + dateArrivee
                + ", dureeVol=" + dureeVol + ", typeAvion=" + typeAvion + ", prix=" + prix + ", siegesDisponibles="
                + siegesDisponibles + ", classe=" + classe + ", statut=" + statut + ", bagagesAutorises="
                + bagagesAutorises + ", imageUrl=" + imageUrl + "]";
    }

}
