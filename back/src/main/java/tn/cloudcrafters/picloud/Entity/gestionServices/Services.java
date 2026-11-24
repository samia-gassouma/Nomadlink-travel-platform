package tn.cloudcrafters.picloud.Entity.gestionServices;



import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.cloudcrafters.picloud.Entity.gestionUser.Partner;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name; // Nom du service
    private String description; // Description détaillée du service
    private double price; // Prix du service

    @Enumerated(EnumType.STRING)
    private ServiceCategory category; // Catégorie du service (ex: Hébergement, Transport, Guide Touristique)

    @Enumerated(EnumType.STRING)
    private ServiceStatus status; // Statut du service (Disponible, Indisponible)

    private String imageUrl; // Image illustrative du service

    @ManyToOne
//    @JoinColumn(name = "partner_id", nullable = false)
    private Partner partner; // Le partenaire qui propose ce service

    @ManyToMany
    @JsonIgnore
    private List<User> users; // Les utilisateurs qui ont choisi ce service
}