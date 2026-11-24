package tn.cloudcrafters.picloud.Entity.gestionboutique;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Max(5)
    private int rating;

    private int helpfulCount = 0;

    @Column(length = 1000)
    private String commentaire;

    private LocalDateTime date;


    @ManyToOne
    @JoinColumn(name = "produit_id")
    @JsonBackReference
    private Produit produit;


    @Column(nullable = false, length = 50)
    private String fullName;




}

