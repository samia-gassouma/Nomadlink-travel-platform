package tn.cloudcrafters.picloud.Service.gestionUser;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionUser.Admin;
import tn.cloudcrafters.picloud.Entity.gestionUser.ERole;
import tn.cloudcrafters.picloud.Repository.gestionUser.AdminRepository;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AdminService implements IAdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin addAdmin(Admin admin) {
        if (admin.getRole() == null) {
            admin.setRole(ERole.ADMIN); // Assigner le rôle ADMIN
        }
//        admin.setCreatedAt(LocalDate.now());
//        admin.setUpdatedAt(LocalDate.now());

        System.out.println("Ajout de l'admin avec rôle : " + admin.getRole()); // Debug

        return adminRepository.save(admin);
    }
//    @Override
//    public Admin updateAdmin(Admin admin) {
//        admin.setUpdatedAt(LocalDate.now());
//        return adminRepository.save(admin);
//    }

    @Override
    public Admin updateAdmin(Long id, Admin adminDetails) {
        // Récupérer l'admin par ID
        Optional<Admin> optionalAdmin = adminRepository.findById(id);

        if (optionalAdmin.isPresent()) {
            Admin adminToUpdate = optionalAdmin.get();

            // Mettre à jour les informations de l'admin
            adminToUpdate.setFirstname(adminDetails.getFirstname());
            adminToUpdate.setLastname(adminDetails.getLastname());
            adminToUpdate.setEmail(adminDetails.getEmail());
            adminToUpdate.setPassword(adminDetails.getPassword());
            adminToUpdate.setPhoneNumber(adminDetails.getPhoneNumber());
            adminToUpdate.setAddress(adminDetails.getAddress());
            adminToUpdate.setCountry(adminDetails.getCountry());
            adminToUpdate.setRole(adminDetails.getRole());
            adminToUpdate.setDateOfBirth(adminDetails.getDateOfBirth());
            adminToUpdate.setGenre(adminDetails.getGenre());
            adminToUpdate.setProfilePicture(adminDetails.getProfilePicture());
//            adminToUpdate.setUpdatedAt(LocalDate.now());

            // Sauvegarder les modifications
            return adminRepository.save(adminToUpdate);
        } else {
            // Si l'admin n'est pas trouvé
            return null;
        }
    }

    @Override
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}