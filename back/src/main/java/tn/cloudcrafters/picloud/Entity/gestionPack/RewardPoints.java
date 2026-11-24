package tn.cloudcrafters.picloud.Entity.gestionPack;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.util.Date;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RewardPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int points;
    @Temporal(TemporalType.TIMESTAMP)
    private Date valid_until;
    @Temporal(TemporalType.TIMESTAMP)
    private Date updated_at;
    private Boolean is_active;
    private Float value;
    private String token;
    private boolean token_applied;

    @OneToOne
    @JsonIgnoreProperties("rewardPoints")
    private User user;


}
