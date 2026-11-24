package tn.cloudcrafters.picloud.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tn.cloudcrafters.picloud.Entity.Activity;
import tn.cloudcrafters.picloud.Entity.Destination;
import tn.cloudcrafters.picloud.Repository.ActivityRepository;
import tn.cloudcrafters.picloud.Repository.DestinationRepository;
import tn.cloudcrafters.picloud.Service.ActivityService;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ActivityController {

    private final String UPLOAD_DIR = "/images/activities";


    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityService activityService;

    // CREATE - Add a new Activity
    @PostMapping("")
    public ResponseEntity<Activity> addActivity(
            @RequestParam(required = false) String destinationId,
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

        Activity activity = new Activity();
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

        if (destinationId != null) {
            Optional<Destination> destination = destinationRepository.findById(Long.parseLong(destinationId));
            destination.ifPresent(activity::setDestination);
        }

        // Handle main image upload (if any)
        if (mainImage != null && !mainImage.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + mainImage.getOriginalFilename();
                Path path = Paths.get("uploads/" + fileName);
                Files.createDirectories(path.getParent()); // Create the directory if it doesn't exist
                Files.write(path, mainImage.getBytes()); // Save the image
                activity.setMainImage(fileName);  // Store the image file path as byte[]
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        Activity savedActivity = activityService.saveActivity(activity);
        return ResponseEntity.ok(savedActivity);
    }

    // READ - Get all Activities
    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        try {
            List<Activity> activities = activityService.getAllActivities();
            if (activities.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(activities);
            }
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path path = Paths.get("uploads/" + filename);
            byte[] image = Files.readAllBytes(path);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/jpeg")
                    .body(image);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    // READ - Get Activity by ID
    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // UPDATE - Update Activity by ID
    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(
            @PathVariable Long id,
            @RequestParam(required = false) String destinationId,
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
            @RequestParam(required = false) MultipartFile mainImage
    ) {
        Activity existingActivity = activityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));

        existingActivity.setActivityName(activityName);

        existingActivity.setActivityDescription(activityDescription);
        existingActivity.setActivityType(activityType);
        existingActivity.setActivityLocation(activityLocation);
        existingActivity.setPriceType(priceType);
        existingActivity.setPriceRange(priceRange);
        existingActivity.setBookingRequired(bookingRequired);
        existingActivity.setDuration(duration);
        existingActivity.setDifficultyLevel(difficultyLevel);
        existingActivity.setRequiredEquipment(requiredEquipment);
        existingActivity.setSafetyTips(safetyTips);
        existingActivity.setAccessibility(accessibility);
        existingActivity.setLanguages(languages);
        existingActivity.setGalleryImages(galleryImages);


        if (destinationId != null) {
            Optional<Destination> destination = destinationRepository.findById(Long.parseLong(destinationId));
            destination.ifPresent(existingActivity::setDestination);
        }

        if (mainImage != null && !mainImage.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + mainImage.getOriginalFilename();
                Path path = Paths.get("uploads/" + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, mainImage.getBytes());

                // Save the file path or name to the database
                existingActivity.setMainImage(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }


        Activity updatedActivity = activityRepository.save(existingActivity);
        return ResponseEntity.ok(updatedActivity);
    }


    // DELETE - Delete Activity by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        Optional<Activity> activity = activityService.getActivityById(id);
        if (activity.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }




    // Spring Boot example
    @GetMapping("/activities/count-by-destination")
    public Map<String, Long> countActivitiesByDestination() {
        return activityRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(a -> a.getDestination().getName(), Collectors.counting()));
    }






    @GetMapping("/by-destination/{destinationId}")
    public ResponseEntity<List<Activity>> getActivitiesByDestination(@PathVariable Long destinationId) {
        List<Activity> activities = activityRepository.findByDestinationId(destinationId);
        return ResponseEntity.ok(activities);
    }

}

