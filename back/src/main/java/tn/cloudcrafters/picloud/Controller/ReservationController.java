package tn.cloudcrafters.picloud.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.Reservation;
import tn.cloudcrafters.picloud.Entity.Vol;
import tn.cloudcrafters.picloud.Repository.IVolRepository;
import tn.cloudcrafters.picloud.Service.IReservationService;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")  // Permet les requêtes depuis le front-end sur http://localhost:4200
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final IReservationService reservationService;

    @Autowired
    public ReservationController(IReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/users/{userId}/vols/{volId}")
    public ResponseEntity<Reservation> createVolReservation(
            @PathVariable Integer userId,
            @PathVariable Integer volId,
            @RequestBody Reservation reservation) {
        return new ResponseEntity<>(reservationService.createReservation(userId, volId, reservation), HttpStatus.CREATED);
    }

    @PostMapping("/users/{userId}/events/{eventId}")
    public ResponseEntity<Reservation> createEventReservation(
            @PathVariable Integer userId,
            @PathVariable Integer eventId,
            @RequestBody Reservation reservation) {
        return new ResponseEntity<>(reservationService.createEventReservation(userId, eventId, reservation), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Integer id) {
        reservationService.deleteReservation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return new ResponseEntity<>(reservationService.getAllReservations(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Integer id) {
        return new ResponseEntity<>(reservationService.getReservationById(id), HttpStatus.OK);
    }
    @Autowired
    private IVolRepository volRepository;

    @GetMapping("/vols")
    public ResponseEntity<List<Vol>> getAllVols() {
        return new ResponseEntity<>(volRepository.findAll(), HttpStatus.OK);
    }

}
