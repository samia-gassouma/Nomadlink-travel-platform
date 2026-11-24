package tn.cloudcrafters.picloud.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.cloudcrafters.picloud.Entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
    // You can add custom query methods here if needed
}
