package tn.cloudcrafters.picloud.Entity.gestionPack;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PricePlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private PricePlanType name;
    private String description;
    private float price;

    @ManyToOne
    @JsonIgnoreProperties({"pricePlans","discount","vol","paiements"})
    private Pack pack;
}
