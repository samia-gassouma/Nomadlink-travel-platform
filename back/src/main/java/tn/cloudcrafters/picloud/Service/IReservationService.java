package tn.cloudcrafters.picloud.Service;

import tn.cloudcrafters.picloud.Entity.Reservation;

import java.util.List;

public interface IReservationService {
    Reservation createReservation(Integer userId, Integer volId, Reservation reservation);
    Reservation createEventReservation(Integer userId, Integer eventId, Reservation reservation);
    void deleteReservation(Integer id);
    List<Reservation> getAllReservations();
    Reservation getReservationById(Integer id);
}
