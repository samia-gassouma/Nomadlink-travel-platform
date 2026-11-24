package tn.cloudcrafters.picloud.Entity.gestionUser;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import tn.cloudcrafters.picloud.Entity.gestionServices.Services;

import java.time.LocalDate;
import java.util.List;

@DiscriminatorValue("PARTNER") // Valeur discriminante pour cette classe

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder


public class Partner extends User{
    @Enumerated(EnumType.STRING)
    private BusinessCategory businessCategory; // Catégorie d'entreprise (agence de voyages, hôtel, etc.)
    private String partnerDescription; // Description du partenaire
    @Enumerated(EnumType.STRING)
    private PartnershipStatus partnershipStatus; // Statut du partenariat
    private LocalDate contractStartDate; // Date de début du contrat
    private LocalDate contractEndDate;   // Date de fin du contrat
    private String websiteURL;         // URL du site web du partenaire

    @OneToMany(mappedBy = "partner", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Services> services; // Un partenaire propose plusieurs services


}