package tn.cloudcrafters.picloud.Service;



import tn.cloudcrafters.picloud.Entity.Destination;

import java.util.List;
import java.util.Optional;

public interface IDestinationService {


    List<Destination> getAllDestinations();

    Destination getDestinationById(Long id);

    Destination addDestination(Destination destination);

    Destination updateDestination(Long id, Destination destination);

    void deleteDestination(Long id);
}