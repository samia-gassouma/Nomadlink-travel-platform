package tn.cloudcrafters.picloud.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.Event;
import tn.cloudcrafters.picloud.Repository.EventRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setType(updatedEvent.getType());
            event.setStartDateTime(updatedEvent.getStartDateTime());
            event.setEndDateTime(updatedEvent.getEndDateTime());
            event.setLocation(updatedEvent.getLocation());
            event.setDuration(updatedEvent.getDuration());
            event.setLanguage(updatedEvent.getLanguage());
            event.setSchedule(updatedEvent.getSchedule());
            event.setRegistrationFee(updatedEvent.getRegistrationFee());
            if (updatedEvent.getImageUrl() != null) {
                event.setImageUrl(updatedEvent.getImageUrl());
            }
            return eventRepository.save(event);
        }).orElse(null);
    }
}
