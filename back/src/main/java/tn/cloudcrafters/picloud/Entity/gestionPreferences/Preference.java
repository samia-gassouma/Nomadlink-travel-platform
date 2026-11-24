package tn.cloudcrafters.picloud.Entity.gestionPreferences;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@Builder
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@Column(nullable = false, unique = true)
    private String name; // Exemple: "Plage", "Montagne", "Aventure", "Culture"

    private String pic;

    @Enumerated(EnumType.STRING)
    private PreferenceCategory category; // Catégorie de la préférence : DESTINATION, ACTIVITE, ...

    @ManyToMany
    private List<User> users;



}
