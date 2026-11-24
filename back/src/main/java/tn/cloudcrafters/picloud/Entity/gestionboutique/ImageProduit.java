package tn.cloudcrafters.picloud.Entity.gestionboutique;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageProduit implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "produit_id")
    @JsonBackReference
    private Produit produit;


    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB") // important
    private byte[] image;
    // Méthode pour définir l'image
    public void setImage(byte[] image) {
        this.image = image;
    }

}

