package tn.cloudcrafters.picloud.Entity.gestionPack;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.Vol;


import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pack implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String packName;
    @Enumerated (EnumType.STRING)
    private PackType packType;
    private String packDescription;
    @Temporal(TemporalType.DATE)
    private Date date_debut;
    @Temporal(TemporalType.DATE)
    private Date date_fin;
    private String packImage;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnoreProperties({"pack","reservations"})
    private Vol vol;

    @ManyToOne
    @JsonIgnoreProperties("packs")
    private Discount discount;

    @OneToMany(mappedBy = "pack", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("price ASC")
    private Set<PricePlan> pricePlans;

    //@OneToMany(cascade = CascadeType.ALL, mappedBy = "pack")
    //private Set<PackAssociation> packAssociations;

    @OneToMany(mappedBy = "pack")
    private Set<Paiement> paiements;



}
