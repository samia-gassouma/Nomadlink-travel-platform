package tn.cloudcrafters.picloud.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reservation")
@JsonInclude(JsonInclude.Include.NON_NULL) // Ignore null fields
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idReservation;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user; // The user who made the reservation

    @ManyToOne
    @JoinColumn(name = "vol_id")
    private Vol vol; // The flight reserved (if it's a flight)

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event; // The event reserved (if it's an event)

    private String nomPassager;
    private String numeroPasseport;

    @Enumerated(EnumType.STRING)
    private Vol.Classe classe; // Class of the flight (economy, business...)

    private Double prixPaye; // Amount paid

    @Setter
    @Enumerated(EnumType.STRING)
    private ModePaiement modePaiement; // Payment method

    @Enumerated(EnumType.STRING)
    private StatutReservation statut; // Reservation status

    private String numeroSiege; // Seat number for a flight

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateReservation = LocalDateTime.now(); // Date of reservation

    public enum ModePaiement {
        Carte_bancaire, PayPal, Virement
    }

    public enum StatutReservation {
        Confirmée, Annulée, En_attente
    }

    public Integer getIdReservation() {
        return idReservation;
    }

    public void setIdReservation(Integer idReservation) {
        this.idReservation = idReservation;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Vol getVol() {
        return vol;
    }

    public void setVol(Vol vol) {
        this.vol = vol;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getNomPassager() {
        return nomPassager;
    }

    public void setNomPassager(String nomPassager) {
        this.nomPassager = nomPassager;
    }

    public String getNumeroPasseport() {
        return numeroPasseport;
    }

    public void setNumeroPasseport(String numeroPasseport) {
        this.numeroPasseport = numeroPasseport;
    }

    public Vol.Classe getClasse() {
        return classe;
    }

    public void setClasse(Vol.Classe classe) {
        this.classe = classe;
    }

    public Double getPrixPaye() {
        return prixPaye;
    }

    public void setPrixPaye(Double prixPaye) {
        this.prixPaye = prixPaye;
    }

    public ModePaiement getModePaiement() {
        return modePaiement;
    }

    public void setModePaiement(ModePaiement modePaiement) {
        this.modePaiement = modePaiement;
    }

    public StatutReservation getStatut() {
        return statut;
    }

    public void setStatut(StatutReservation statut) {
        this.statut = statut;
    }

    public String getNumeroSiege() {
        return numeroSiege;
    }

    public void setNumeroSiege(String numeroSiege) {
        this.numeroSiege = numeroSiege;
    }

    public LocalDateTime getDateReservation() {
        return dateReservation;
    }

    public void setDateReservation(LocalDateTime dateReservation) {
        this.dateReservation = dateReservation;
    }
}
