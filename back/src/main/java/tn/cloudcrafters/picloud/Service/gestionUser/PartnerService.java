package tn.cloudcrafters.picloud.Service.gestionUser;



import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.cloudcrafters.picloud.Entity.gestionServices.Services;
import tn.cloudcrafters.picloud.Entity.gestionUser.ERole;
import tn.cloudcrafters.picloud.Entity.gestionUser.Partner;
import tn.cloudcrafters.picloud.Entity.gestionUser.Role;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Repository.gestionUser.PartnerRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PartnerService  implements IPartnerService  {

    @Autowired
    private PartnerRepository partnerRepository;

    @Override
    // Ajouter un partenaire
    public Partner addPartner(Partner partner) {
        if (partner.getRole() == null) {
            partner.setRole(ERole.PARTNER);
        }
//        partner.setCreatedAt(LocalDate.now());
//        partner.setUpdatedAt(LocalDate.now());

        System.out.println("Ajout du partenaire avec rôle : " + partner.getRole()); // Debug

        return partnerRepository.save(partner);
    }



    //    @Override
//    public Partner updatePartner(Partner partner) {
//        partner.setUpdatedAt(LocalDate.now());
//        return partnerRepository.save(partner);
//    }
    @Override
    public Partner updatePartner(Long id, Partner partnerDetails) {
        // Recherche du partenaire par ID
        Optional<Partner> optionalPartner = partnerRepository.findById(id);

        if (optionalPartner.isPresent()) {
            Partner partnerToUpdate = optionalPartner.get();

            // Mise à jour des informations du partenaire
            partnerToUpdate.setFirstname(partnerDetails.getFirstname());
            partnerToUpdate.setLastname(partnerDetails.getLastname());
            partnerToUpdate.setEmail(partnerDetails.getEmail());
            partnerToUpdate.setPhoneNumber(partnerDetails.getPhoneNumber());
            partnerToUpdate.setAddress(partnerDetails.getAddress());
            partnerToUpdate.setCountry(partnerDetails.getCountry());
            partnerToUpdate.setProfilePicture(partnerDetails.getProfilePicture());

            partnerToUpdate.setBusinessCategory(partnerDetails.getBusinessCategory());
            partnerToUpdate.setPartnerDescription(partnerDetails.getPartnerDescription());
            partnerToUpdate.setPartnershipStatus(partnerDetails.getPartnershipStatus());
            partnerToUpdate.setContractStartDate(partnerDetails.getContractStartDate());
            partnerToUpdate.setContractEndDate(partnerDetails.getContractEndDate());
            partnerToUpdate.setWebsiteURL(partnerDetails.getWebsiteURL());

             //Mise à jour de la date de modification
            partnerToUpdate.setLastModifiedDate(LocalDateTime.now());
            return partnerRepository.save(partnerToUpdate);


        } else {
            // Si le partenaire n'est pas trouvé
            return null;
        }
    }

    @Override
    public Partner getPartnerById(Long id) {
        return partnerRepository.findById(id).orElse(null);
    }

    @Override
    public List<Partner> getAllPartners() {
//        return partnerRepository.findAll();
        return partnerRepository.findByRole(ERole.PARTNER);

    }

//    @Override
//    public void deletePartner(Long id) {
//
////        partnerRepository.deleteById(id);
//
//        Partner partner = partnerRepository.findById(id).orElseThrow(() -> new RuntimeException("Partner not found"));
//
//        // Supprimer l'utilisateur des rôles
//        for (Role role : partner.getRoles()) {
//            role.getUsers().remove(partner);
//        }
//        partnerRepository.delete(partner);
//
//    }

    @Override
    @Transactional
    public void deletePartner(Long id) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partner not found"));

        // Supprimer l'utilisateur des rôles
        for (Role role : partner.getRoles()) {
            role.getUsers().remove(partner);
        }

        // Nettoyer d'abord les relations entre les services du partenaire et les utilisateurs
        if (partner.getServices() != null) {
            for (Services service : partner.getServices()) {
                if (service.getUsers() != null && !service.getUsers().isEmpty()) {
                    List<User> users = new ArrayList<>(service.getUsers());
                    for (User user : users) {
                        if (user.getSelectedServices() != null) {
                            user.getSelectedServices().remove(service);
                        }
                    }
                    service.getUsers().clear();
                }
            }
        }

        // Maintenant supprimer le partenaire et ses services (par cascade)
        partnerRepository.delete(partner);
    }

    public Partner updateUserProfilePicture(Long userId, String fileName) {
        Partner partner = partnerRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        partner.setProfilePicture(fileName);
        return partnerRepository.save(partner);
    }

}
