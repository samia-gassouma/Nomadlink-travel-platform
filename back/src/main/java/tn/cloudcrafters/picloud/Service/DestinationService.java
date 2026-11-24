package tn.cloudcrafters.picloud.Service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.Activity;
import tn.cloudcrafters.picloud.Entity.Destination;
import tn.cloudcrafters.picloud.Repository.ActivityRepository;
import tn.cloudcrafters.picloud.Repository.DestinationRepository;


import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class    DestinationService{

    @Autowired
    private DestinationRepository destinationRepository;
    @Autowired
    private ActivityRepository activityRepository;

    public Destination saveDestination(Destination destination) {
        return destinationRepository.save(destination);
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Optional<Destination> getDestinationById(Long id) {
        return destinationRepository.findById(id);
    }

    public void deleteDestination(Long id) {
        destinationRepository.deleteById(id);
    }

    public Destination updateDestination(Long id, Destination updatedDestination) {
        return destinationRepository.findById(id).map(destination -> {
            destination.setName(updatedDestination.getName());
            destination.setCountry(updatedDestination.getCountry());
            destination.setType(updatedDestination.getType());
            destination.setDescription(updatedDestination.getDescription());
            destination.setLanguage(updatedDestination.getLanguage());
            destination.setCurrency(updatedDestination.getCurrency());
            destination.setClimate(updatedDestination.getClimate());
            destination.setVisaRequired(updatedDestination.isVisaRequired());
            destination.setSafetyTips(updatedDestination.getSafetyTips());
            destination.setBestTimeToVisit(updatedDestination.getBestTimeToVisit());

            if (updatedDestination.getMainImageUrl() != null) {
                destination.setMainImageUrl(updatedDestination.getMainImageUrl());
            }

            if (updatedDestination.getGalleryImages() != null) {
                destination.setGalleryImages(updatedDestination.getGalleryImages());
            }

            if (updatedDestination.getMapUrl() != null) {
                destination.setMapUrl(updatedDestination.getMapUrl());
            }

            return destinationRepository.save(destination);
        }).orElse(null);
    }

    public List<Activity> getActivitiesByDestinationId(Long destinationId) {
        return destinationRepository.findById(destinationId)
                .map(Destination::getActivities)
                .orElse(Collections.emptyList());
    }

    public Activity addActivityToDestination(Long destinationId, Activity activity) {
        return destinationRepository.findById(destinationId)
                .map(destination -> {
                    activity.setDestination(destination);
                    return activityRepository.save(activity);
                })
                .orElseThrow(() -> new EntityNotFoundException("Destination not found with id: " + destinationId));
    }


}