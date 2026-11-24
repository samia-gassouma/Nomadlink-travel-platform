package tn.cloudcrafters.picloud.Service;


import tn.cloudcrafters.picloud.Entity.Activity;

import java.util.List;
import java.util.Optional;

public interface IActivityService {

    // Save an activity
    Activity saveActivity(Activity activity);

    // Get all activities
    List<Activity> getAllActivities();

    // Get activity by ID
    Optional<Activity> getActivityById(Long id);

    // Delete activity by ID
    void deleteActivity(Long id);

    // Update activity
    Activity updateActivity(Long id, Activity activity);
}