package tn.cloudcrafters.picloud.Repository.gestionUser;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.cloudcrafters.picloud.Entity.gestionUser.ERole;
import tn.cloudcrafters.picloud.Entity.gestionUser.Partner;

import java.util.List;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    List<Partner> findByRole(ERole role);

}