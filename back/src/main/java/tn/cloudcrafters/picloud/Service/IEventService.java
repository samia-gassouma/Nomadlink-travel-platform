package tn.cloudcrafters.picloud.Service;


import tn.cloudcrafters.picloud.Entity.Event;

import java.util.List;

public interface IEventService {
    Event save(Event event);
    Event update(Integer id, Event event);
    void delete(Integer id);
    Event getById(Integer id);
    List<Event> getAll();
}
