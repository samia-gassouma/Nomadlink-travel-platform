package tn.cloudcrafters.picloud.Repository.gestionUser;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.cloudcrafters.picloud.Entity.gestionUser.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String roleStudent);

}
