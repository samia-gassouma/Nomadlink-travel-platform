package tn.cloudcrafters.picloud.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.cloudcrafters.picloud.Entity.Activity;


import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByDestinationId(Long destinationId);



}

