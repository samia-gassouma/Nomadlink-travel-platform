package tn.cloudcrafters.picloud.Repository.gestionServices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionServices.Services;
import tn.cloudcrafters.picloud.Entity.gestionUser.Partner;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {
    // Trouver tous les services d'un partenaire
    List<Services> findByPartner(Partner partner);

    // Trouver tous les services d'un partenaire par son ID
    List<Services> findByPartnerId(Long partnerId);

    // Trouver tous les services sélectionnés par un utilisateur
    List<Services> findByUsersContaining(User user);
}