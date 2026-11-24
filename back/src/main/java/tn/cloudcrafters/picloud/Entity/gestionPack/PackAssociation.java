package tn.cloudcrafters.picloud.Entity.gestionPack;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.Activity;
import tn.cloudcrafters.picloud.Entity.Destination;

import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackAssociation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    private Pack pack;

    @ManyToOne
    @JsonIgnoreProperties({"activities","events","users"})
    private Destination destination;

    @ManyToMany
    @JoinTable(
            name = "packassociation_activities",
            joinColumns = @JoinColumn(name = "packassociation_id"),
            inverseJoinColumns = @JoinColumn(name = "activity_id")
    )
    @JsonIgnoreProperties({"destination","users"})
    private List<Activity> activities;

}
