package tn.cloudcrafters.picloud.Dto_gestionUser;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import tn.cloudcrafters.picloud.Entity.gestionUser.BusinessCategory;
import tn.cloudcrafters.picloud.Entity.gestionUser.ERole;
import tn.cloudcrafters.picloud.Entity.gestionUser.Genre;
import tn.cloudcrafters.picloud.Entity.gestionUser.PartnershipStatus;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PartnerDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String phoneNumber;
    private String password;
    private String address;
    private String country;
    private ERole role;
    private boolean accountLocked;
    private boolean enabled;
    private BusinessCategory businessCategory;
    private String partnerDescription;
    private PartnershipStatus partnershipStatus;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private String websiteURL;
    private String profilePicture;


}
