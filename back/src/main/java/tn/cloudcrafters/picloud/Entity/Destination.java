package tn.cloudcrafters.picloud.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.PackAssociation;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Destination {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    private String type; // ville, plage, montagne, desert, campagne, autre
    private String description;
    private String language;
    private String currency;
    private String climate; // tropical, tempere, continental, polaire, aride
    private boolean visaRequired;
    private String safetyTips;

    @ElementCollection
    private List<String> bestTimeToVisit; // List of months

    @ElementCollection
    private List<String> galleryImages;

    private String mainImageUrl;
    private String mapUrl;


    @ManyToMany
    private List<User> users;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("destination") // Pour éviter la récursion infinie lors de la sérialisation JSON
    private List<Activity> activities;


    @OneToMany(mappedBy = "destination",cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<PackAssociation> packAssociations;

}