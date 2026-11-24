package tn.cloudcrafters.picloud.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tn.cloudcrafters.picloud.Entity.Event;
import tn.cloudcrafters.picloud.Repository.EventRepository;
import tn.cloudcrafters.picloud.Service.EventService;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")

public class EventController {

    private final String UPLOAD_DIR = "uploads/";
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventService eventService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
        if (event.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("")
    public ResponseEntity<Event> addEvent(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String startDateTimeStr,
            @RequestParam(required = false) String endDateTimeStr,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String duration,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String schedule,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String registrationFee,
            @RequestParam(required = false) MultipartFile image) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        LocalDateTime startDateTime = LocalDateTime.now(); // Default to current date and time
        LocalDateTime endDateTime = LocalDateTime.now().plusHours(1); // Default to 1 hour after current time

        // Use provided values if available
        if (startDateTimeStr != null) {
            try {
                startDateTime = LocalDateTime.parse(startDateTimeStr, formatter);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Invalid date format
            }
        }
        if (endDateTimeStr != null) {
            try {
                endDateTime = LocalDateTime.parse(endDateTimeStr, formatter);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Invalid date format
            }
        }

        Event event = new Event();
        event.setTitle(title);
        event.setType(type);

        // Convert LocalDateTime back to String before setting it
        event.setStartDateTime(startDateTime.format(formatter));
        event.setEndDateTime(endDateTime.format(formatter));

        event.setLocation(location);
        event.setDuration(duration);
        event.setLanguage(language);
        event.setSchedule(schedule);
        event.setDescription(description);
        event.setRegistrationFee(registrationFee);

        // Handle image upload (same logic as before)
        if (image != null && !image.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent()); // Créer le répertoire si nécessaire
                Files.write(path, image.getBytes()); // Sauvegarder l'image
                event.setImageUrl(fileName); // URL relative pour servir l'image
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }


        Event savedEvent = eventService.saveEvent(event);
        return ResponseEntity.ok(savedEvent);
    }


    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        try {
            List<Event> events = eventService.getAllEvents();
            if (events.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(events);
            }
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/api/events/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        existingEvent.setTitle(eventDetails.getTitle());
        existingEvent.setDescription(eventDetails.getDescription());
        existingEvent.setStartDateTime(eventDetails.getStartDateTime());
        existingEvent.setEndDateTime(eventDetails.getEndDateTime());
        existingEvent.setLocation(eventDetails.getLocation());
        existingEvent.setDuration(eventDetails.getDuration());
        existingEvent.setLanguage(eventDetails.getLanguage());
        existingEvent.setSchedule(eventDetails.getSchedule());
        existingEvent.setRegistrationFee(eventDetails.getRegistrationFee());
        existingEvent.setImageUrl(eventDetails.getImageUrl());

        Event updatedEvent = eventRepository.save(existingEvent);
        return ResponseEntity.ok(updatedEvent);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PutMapping("{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String startDateTimeStr,
            @RequestParam(required = false) String endDateTimeStr,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String duration,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String schedule,
            @RequestParam(required = false) String registrationFee,
            @RequestParam(required = false) MultipartFile image) {

        Optional<Event> existingEvent = eventService.getEventById(id);
        if (existingEvent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Event event = existingEvent.get();

        // Update the event fields using setters
        if (title != null) event.setTitle(title);
        if (type != null) event.setType(type);
        if (startDateTimeStr != null) {
            try {
                event.setStartDateTime(LocalDateTime.parse(startDateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")).toString());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        if (endDateTimeStr != null) {
            try {
                event.setEndDateTime(LocalDateTime.parse(endDateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")).toString());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        if (location != null) event.setLocation(location);
        if (duration != null) event.setDuration(duration);
        if (language != null) event.setLanguage(language);
        if (schedule != null) event.setSchedule(schedule);
        if (registrationFee != null) event.setRegistrationFee(registrationFee);

        // Handle the image upload (same as in the add method)
        if (image != null && !image.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, image.getBytes());
                event.setImageUrl(path.toString());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        // Save the updated event
        Event updatedEvent = eventService.updateEvent(id, event);
        return updatedEvent != null ? ResponseEntity.ok(updatedEvent) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
