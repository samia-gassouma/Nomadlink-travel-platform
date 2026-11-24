package tn.cloudcrafters.picloud.Entity.gestionPack;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date_emission;
    private Long montant_total;
    private String url;
    @OneToOne(mappedBy = "facture", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("facture")
    private Paiement paiement;

    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonIgnoreProperties("rewardPoints")
    private User user;

}
