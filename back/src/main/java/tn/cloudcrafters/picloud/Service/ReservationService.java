package tn.cloudcrafters.picloud.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.Event;
import tn.cloudcrafters.picloud.Entity.Reservation;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Entity.Vol;
import tn.cloudcrafters.picloud.Repository.EventRepository;
import tn.cloudcrafters.picloud.Repository.IReservationRepository;
import tn.cloudcrafters.picloud.Repository.IVolRepository;
import tn.cloudcrafters.picloud.Repository.gestionUser.UserRepository;

import java.util.List;

@Service
public class ReservationService implements IReservationService {

    private final IReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final IVolRepository volRepository;
    private final EventRepository eventRepository;

    @Autowired
    public ReservationService(IReservationRepository reservationRepository, UserRepository userRepository,
                              IVolRepository volRepository, EventRepository eventRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.volRepository = volRepository;
        this.eventRepository = eventRepository;
    }

    public Reservation createReservation(Integer userId, Integer volId, Reservation reservation) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found!"));
        Vol vol = volRepository.findById(volId)
                .orElseThrow(() -> new RuntimeException("Vol with ID " + volId + " not found!"));

        // ✅ Vérifier s'il reste des places disponibles avant de réserver
        if (vol.getSiegesDisponibles() <= 0) {
            throw new RuntimeException("❌ Plus de sièges disponibles pour ce vol !");
        }

        // ✅ Décrémenter le nombre de sièges disponibles
        vol.setSiegesDisponibles(vol.getSiegesDisponibles() - 1);
        volRepository.save(vol); // ✅ Sauvegarde du changement dans la BD

        reservation.setUser(user);
        reservation.setVol(vol);
        reservation.setEvent(null);
        return reservationRepository.save(reservation);
    }

    @Autowired
    private MailSenderService mailSenderService;

    @Override
    public Reservation createEventReservation(Integer userId, Integer eventId, Reservation reservation) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Event event = eventRepository.findById(Long.valueOf(eventId))
                .orElseThrow(() -> new RuntimeException("Event not found!"));

        reservation.setUser(user);
        reservation.setEvent(event);
        reservation.setVol(null); // Pas de vol pour un événement
        return reservationRepository.save(reservation);
    }

    @Override
    public void deleteReservation(Integer id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found!");
        }
        reservationRepository.deleteById(id);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getReservationById(Integer id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found!"));
    }
}
