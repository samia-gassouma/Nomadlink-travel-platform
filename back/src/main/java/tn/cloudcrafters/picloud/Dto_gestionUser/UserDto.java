package tn.cloudcrafters.picloud.Dto_gestionUser;

import lombok.*;
import tn.cloudcrafters.picloud.Entity.gestionUser.ERole;
import tn.cloudcrafters.picloud.Entity.gestionUser.Genre;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private String country;
    private ERole role;
    private LocalDate dateOfBirth;
    private Genre genre;
    private String profilePicture;
    private boolean accountLocked;
    private boolean enabled;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private boolean hasSelectedPreferences;
    private String fullName; // Ajout du champ fullName
    private String username; // Ajout du champ username



}
