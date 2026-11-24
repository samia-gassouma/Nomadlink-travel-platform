package tn.cloudcrafters.picloud.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.Destination;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
}


