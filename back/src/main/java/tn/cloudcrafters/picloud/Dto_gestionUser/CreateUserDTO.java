package tn.cloudcrafters.picloud.Dto_gestionUser;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import tn.cloudcrafters.picloud.Entity.gestionUser.ERole;
import tn.cloudcrafters.picloud.Entity.gestionUser.Genre;

import java.time.LocalDate;
@Getter
@Setter
@Builder
public class CreateUserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private String country;
    private ERole role;
    private LocalDate dateOfBirth;
    private Genre genre;
    private String profilePicture;
}
