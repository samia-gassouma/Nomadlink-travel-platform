package tn.cloudcrafters.picloud.Entity.gestionUser;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN") // Valeur discriminante pour cette classe

public class Admin extends User{
}
