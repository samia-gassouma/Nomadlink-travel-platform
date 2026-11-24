package tn.cloudcrafters.picloud.Entity.gestionclaim;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.time.LocalDateTime;
 
@Entity
@Getter
@Setter
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_claim;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private String description;
    @Enumerated(EnumType.STRING)
    private ClaimStatus status = ClaimStatus.PENDING;
    @CreationTimestamp
    private LocalDateTime createdAt;
}