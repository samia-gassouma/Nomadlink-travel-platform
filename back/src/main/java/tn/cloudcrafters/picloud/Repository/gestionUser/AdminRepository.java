package tn.cloudcrafters.picloud.Repository.gestionUser;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.cloudcrafters.picloud.Entity.gestionUser.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}