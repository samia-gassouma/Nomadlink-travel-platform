package tn.cloudcrafters.picloud.Controller;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tn.cloudcrafters.picloud.Entity.Activity;
import tn.cloudcrafters.picloud.Entity.Destination;
import tn.cloudcrafters.picloud.Service.DestinationService;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/destinations")

public class DestinationController {

    private final String UPLOAD_DIR = "uploads/";
    @Autowired
    private DestinationService destinationService;





    @PostMapping
    public ResponseEntity<Destination> createDestination(
            @RequestParam String name,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) String climate,
            @RequestParam(required = false) boolean visaRequired,
            @RequestParam(required = false) String safetyTips,
            @RequestParam(required = false) List<String> bestTimeToVisit,
            @RequestParam(required = false) String mapUrl,
            @RequestParam MultipartFile mainImage,
            @RequestParam(required = false) MultipartFile[] galleryImages) {

        try {
            // Save main image
            String mainImageUrl = saveImage(mainImage, "main_");

            // Save gallery images
            // Save gallery images
            List<String> galleryImageUrls = null;
            if (galleryImages != null && galleryImages.length > 0) {
                galleryImageUrls = Arrays.stream(galleryImages)
                        .map(image -> {
                            try {
                                return saveImage(image, "gallery_");
                            } catch (IOException e) {
                                e.printStackTrace(); // ou logger.error(...)
                                return null;
                            }
                        })
                        .filter(url -> url != null)
                        .toList();
            }


            Destination destination = new Destination();
            destination.setName(name);
            destination.setCountry(country);
            destination.setType(type);
            destination.setDescription(description);
            destination.setLanguage(language);
            destination.setCurrency(currency);
            destination.setClimate(climate);
            destination.setVisaRequired(visaRequired);
            destination.setSafetyTips(safetyTips);
            destination.setBestTimeToVisit(bestTimeToVisit);
            destination.setMapUrl(mapUrl);
            destination.setMainImageUrl(mainImageUrl);
            destination.setGalleryImages(galleryImageUrls);

            Destination savedDestination = destinationService.saveDestination(destination);
            return ResponseEntity.ok(savedDestination);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        List<Destination> destinations = destinationService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable Long id) {
        return destinationService.getDestinationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Destination> updateDestination(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) String climate,
            @RequestParam(required = false) Boolean visaRequired,
            @RequestParam(required = false) String safetyTips,
            @RequestParam(required = false) List<String> bestTimeToVisit,
            @RequestParam(required = false) String mapUrl,
            @RequestParam(required = false) MultipartFile mainImage,
            @RequestParam(required = false) MultipartFile[] galleryImages) {

        try {
            Destination destination = destinationService.getDestinationById(id).orElse(null);
            if (destination == null) {
                return ResponseEntity.notFound().build();
            }

            if (name != null) destination.setName(name);
            if (country != null) destination.setCountry(country);
            if (type != null) destination.setType(type);
            if (description != null) destination.setDescription(description);
            if (language != null) destination.setLanguage(language);
            if (currency != null) destination.setCurrency(currency);
            if (climate != null) destination.setClimate(climate);
            if (visaRequired != null) destination.setVisaRequired(visaRequired);
            if (safetyTips != null) destination.setSafetyTips(safetyTips);
            if (bestTimeToVisit != null) destination.setBestTimeToVisit(bestTimeToVisit);
            if (mapUrl != null) destination.setMapUrl(mapUrl);

            if (mainImage != null && !mainImage.isEmpty()) {
                String mainImageUrl = saveImage(mainImage, "main_");
                destination.setMainImageUrl(mainImageUrl);
            }

            if (galleryImages != null && galleryImages.length > 0) {
                List<String> galleryImageUrls = Arrays.stream(galleryImages)
                        .map(image -> {
                            try {
                                return saveImage(image, "gallery_");
                            } catch (IOException e) {
                                return null;
                            }
                        })
                        .toList();
                destination.setGalleryImages(galleryImageUrls);
            }

            Destination updatedDestination = destinationService.updateDestination(id, destination);
            return ResponseEntity.ok(updatedDestination);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }

    private String saveImage(MultipartFile image, String prefix) throws IOException {
        String fileName = prefix + UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, image.getBytes());
        return  fileName;
    }


    @GetMapping("/{id}/activities")
    public ResponseEntity<List<Activity>> getDestinationActivities(@PathVariable Long id) {
        List<Activity> activities = destinationService.getActivitiesByDestinationId(id);
        return ResponseEntity.ok(activities);
    }

    @PostMapping("/{id}/activities")
    public ResponseEntity<Activity> addActivityToDestination(
            @PathVariable Long id,
            @RequestParam(required = false) String activityName,
            @RequestParam(required = false) String activityDescription,
            @RequestParam(required = false) String activityType,
            @RequestParam(required = false) String activityLocation,
            @RequestParam(required = false) String priceType,
            @RequestParam(required = false) String priceRange,
            @RequestParam(required = false) String bookingRequired,
            @RequestParam(required = false) String duration,
            @RequestParam(required = false) String difficultyLevel,
            @RequestParam(required = false) String requiredEquipment,
            @RequestParam(required = false) String safetyTips,
            @RequestParam(required = false) List<String> accessibility,
            @RequestParam(required = false) List<String> languages,
            @RequestParam(required = false) List<String> galleryImages,
            @RequestParam(required = false) MultipartFile mainImage) {

        Destination destination = destinationService.getDestinationById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destination not found"));

        Activity activity = new Activity();
        activity.setDestination(destination);
        activity.setActivityName(activityName);
        activity.setActivityDescription(activityDescription);
        activity.setActivityType(activityType);
        activity.setActivityLocation(activityLocation);
        activity.setPriceType(priceType);
        activity.setPriceRange(priceRange);
        activity.setBookingRequired(bookingRequired);
        activity.setDuration(duration);
        activity.setDifficultyLevel(difficultyLevel);
        activity.setRequiredEquipment(requiredEquipment);
        activity.setSafetyTips(safetyTips);
        activity.setAccessibility(accessibility);
        activity.setLanguages(languages);
        activity.setGalleryImages(galleryImages);

        if (mainImage != null && !mainImage.isEmpty()) {
            try {
                String fileName = "activity_" + UUID.randomUUID() + "_" + mainImage.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, mainImage.getBytes());
                activity.setMainImage("uploads/" + fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        Activity savedActivity = destinationService.addActivityToDestination(id, activity);
        return ResponseEntity.ok(savedActivity);
    }


}


