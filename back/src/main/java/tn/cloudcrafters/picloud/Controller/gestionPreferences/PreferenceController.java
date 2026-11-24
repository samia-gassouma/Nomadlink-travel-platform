package tn.cloudcrafters.picloud.Controller.gestionPreferences;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionPreferences.Preference;
import tn.cloudcrafters.picloud.Entity.gestionPreferences.PreferenceCategory;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Service.gestionPreferences.PreferenceService;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/preferences")
public class PreferenceController {
    @Autowired

    private PreferenceService preferenceService;

    // Ajouter une préférence (utile pour initialiser les préférences)
    @PostMapping("/add")
    public Preference addPreference(@RequestBody Preference preference) {
        return preferenceService.addPreference(preference);
    }

//    @PutMapping("/update")
//    public Preference updatePreference(@RequestBody Preference preference) {
//        return preferenceService.updatePreference(preference);
//    }
    @PutMapping("/update/{id}")
    public Preference updatePreference(@PathVariable("id") Long id, @RequestBody Preference preference) {
        return preferenceService.updatePreference(id, preference); // Passer l'ID et les détails à mettre à jour
    }

    @GetMapping("/{id}")
    public Preference getPreferenceById(@PathVariable("id") Long id) {
        return preferenceService.getPreferenceById(id);
    }

    @GetMapping("/all")
    public List<Preference> getAllPreferences() {
        return preferenceService.getAllPreferences();
    }

    @DeleteMapping("/delete/{id}")
    public void deletePreference(@PathVariable("id") Long id) {
        preferenceService.deletePreference(id);
    }
    @PostMapping("/add/{userId}/{preferenceId}")
    public ResponseEntity<User> addPreferenceToUser(@PathVariable Long userId, @PathVariable Long preferenceId) {
        User updatedUser = preferenceService.addPreferenceToUser(userId, preferenceId);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Preference>> getUserPreferences(@PathVariable Long userId) {
        List<Preference> preferences = preferenceService.getUserPreferences(userId);
        return ResponseEntity.ok(preferences);
    }

    @PostMapping("/add-multiple/{userId}")
    public ResponseEntity<User> addMultiplePreferencesToUser(@PathVariable Long userId, @RequestBody List<Long> preferenceIds) {
        User updatedUser = preferenceService.addMultiplePreferencesToUser(userId, preferenceIds);
        return ResponseEntity.ok(updatedUser);
    }

//    @Transactional
//
//@PostMapping("/add-multiple")
//public ResponseEntity<User> addMultiplePreferencesToUser(@RequestBody List<Long> preferenceIds) {
//    User updatedUser = preferenceService.addMultiplePreferencesToUser(preferenceIds);
//    return ResponseEntity.ok(updatedUser);
//}

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Preference>> getPreferencesByCategory(@PathVariable PreferenceCategory category) {
        List<Preference> preferences = preferenceService.getPreferencesByCategory(category);
        return ResponseEntity.ok(preferences);
    }

    @DeleteMapping("/remove/{userId}/{preferenceId}")
    public ResponseEntity<User> removePreferenceFromUser(@PathVariable Long userId, @PathVariable Long preferenceId) {
        User updatedUser = preferenceService.removePreferenceFromUser(userId, preferenceId);
        return ResponseEntity.ok(updatedUser);
    }

    // Add this endpoint to PreferenceController class
    @GetMapping("/count-users/{preferenceId}")
    public ResponseEntity<Long> countUsersByPreference(@PathVariable Long preferenceId) {
        Long userCount = preferenceService.countUsersByPreference(preferenceId);
        return ResponseEntity.ok(userCount);
    }

}