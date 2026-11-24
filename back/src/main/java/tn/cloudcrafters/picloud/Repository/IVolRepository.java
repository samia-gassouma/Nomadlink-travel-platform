package tn.cloudcrafters.picloud.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.Vol;

@Repository
public interface IVolRepository extends JpaRepository<Vol, Integer> {
}

