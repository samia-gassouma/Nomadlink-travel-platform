package tn.cloudcrafters.picloud.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.cloudcrafters.picloud.Entity.Reservation;

public interface IReservationRepository extends JpaRepository<Reservation, Integer> {
}
