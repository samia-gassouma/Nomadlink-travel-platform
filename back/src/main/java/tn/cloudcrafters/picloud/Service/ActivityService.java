package tn.cloudcrafters.picloud.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.Activity;
import tn.cloudcrafters.picloud.Repository.ActivityRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActivityService implements IActivityService {
    

    @Autowired
    private ActivityRepository activityRepository;

    @Override
    public Activity saveActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    @Override
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @Override
    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }

    @Override
    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }

    @Override
    public Activity updateActivity(Long id, Activity activity) {
        Optional<Activity> existingActivity = activityRepository.findById(id);
        if (existingActivity.isPresent()) {
            Activity updatedActivity = existingActivity.get();
            updatedActivity.setActivityName(activity.getActivityName());
            updatedActivity.setActivityDescription(activity.getActivityDescription());
            updatedActivity.setActivityType(activity.getActivityType());
            updatedActivity.setActivityLocation(activity.getActivityLocation());
            updatedActivity.setPriceType(activity.getPriceType());
            updatedActivity.setPriceRange(activity.getPriceRange());
            updatedActivity.setBookingRequired(activity.getBookingRequired());
            updatedActivity.setDuration(activity.getDuration());
            updatedActivity.setDifficultyLevel(activity.getDifficultyLevel());
            updatedActivity.setRequiredEquipment(activity.getRequiredEquipment());
            updatedActivity.setSafetyTips(activity.getSafetyTips());
            updatedActivity.setAccessibility(activity.getAccessibility());
            updatedActivity.setLanguages(activity.getLanguages());
            updatedActivity.setGalleryImages(activity.getGalleryImages());
            return activityRepository.save(updatedActivity);
        }
        return null; // Activity not found
    }


    public List<Activity> getActivitysById(List<Long> id) {
        return (List<Activity>) activityRepository.findAllById(id);
    }
}

