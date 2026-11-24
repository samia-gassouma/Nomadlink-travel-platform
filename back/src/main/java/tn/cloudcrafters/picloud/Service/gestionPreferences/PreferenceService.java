package tn.cloudcrafters.picloud.Service.gestionPreferences;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionPreferences.Preference;
import tn.cloudcrafters.picloud.Entity.gestionPreferences.PreferenceCategory;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Repository.gestionPreferences.PreferenceRepository;
import tn.cloudcrafters.picloud.Repository.gestionUser.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PreferenceService  implements IPreferenceService{
    @Autowired
    private PreferenceRepository preferenceRepository;

    private final UserRepository userRepository;

    @Override
    public Preference addPreference(Preference preference) {
        return preferenceRepository.save(preference);
    }


//    @Override
//    public Preference updatePreference(Preference preference) {
//        return preferenceRepository.save(preference);
//    }
    @Override
    public Preference updatePreference(Long id, Preference preferenceDetails) {
        // Recherche de la préférence par ID
        Optional<Preference> optionalPreference = preferenceRepository.findById(id);

        if (optionalPreference.isPresent()) {
            Preference preferenceToUpdate = optionalPreference.get();

            // Mise à jour des informations de la préférence
            preferenceToUpdate.setName(preferenceDetails.getName());
            preferenceToUpdate.setPic(preferenceDetails.getPic());
            preferenceToUpdate.setCategory(preferenceDetails.getCategory());

            return preferenceRepository.save(preferenceToUpdate);
        } else {
            // Si la préférence n'est pas trouvée
            return null;
        }
    }

    @Override
    public Preference getPreferenceById(Long id) {
        return preferenceRepository.findById(id).orElse(null);
    }

    @Override
    public List<Preference> getAllPreferences() {
        return preferenceRepository.findAll();
    }

//    @Override
//    public void deletePreference(Long id) {
//        preferenceRepository.deleteById(id);
//    }

    @Override
    public void deletePreference(Long id) {
        Preference preference = preferenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preference not found with id: " + id));

        // Remove this preference from all users that have it selected
        for (User user : preference.getUsers()) {
            user.getPreferences().remove(preference);
            userRepository.save(user);
        }

        // Clear the users list of this preference
        preference.getUsers().clear();
        preferenceRepository.save(preference);

        // Now safely delete the preference
        preferenceRepository.deleteById(id);
    }
    public User addPreferenceToUser(Long userId, Long preferenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Preference preference = preferenceRepository.findById(preferenceId)
                .orElseThrow(() -> new RuntimeException("Preference not found"));

        // Vérifier si la relation existe déjà
        if (!user.getPreferences().contains(preference)) {
            user.getPreferences().add(preference);  // Ajouter la préférence à l'utilisateur
            preference.getUsers().add(user);  // Ajouter l'utilisateur à la préférence
            user.setHasSelectedPreferences(true);  // Marquer que l'utilisateur a sélectionné des préférences

            userRepository.save(user);  // Sauvegarder l'utilisateur
            preferenceRepository.save(preference);  // Sauvegarder la préférence mise à jour
        }

        return user;
    }



    // Obtenir les préférences d'un utilisateur
    public List<Preference> getUserPreferences(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPreferences();
    }


    public User addMultiplePreferencesToUser(Long userId, List<Long> preferenceIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Preference> preferencesToAdd = preferenceRepository.findAllById(preferenceIds);

        // Éviter d'ajouter les préférences déjà existantes
        for (Preference preference : preferencesToAdd) {
            if (!user.getPreferences().contains(preference)) {
                user.getPreferences().add(preference);
                preference.getUsers().add(user); // Assurer la relation bidirectionnelle
            }
        }

        user.setHasSelectedPreferences(true);
        return userRepository.save(user);
    }


//    public User addMultiplePreferencesToUser(List<Long> preferenceIds) {
//        // Récupérer l'authentification
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication != null && authentication.isAuthenticated()) {
//            // Récupérer l'utilisateur connecté
//            User user = (User) authentication.getPrincipal();
//
//            // Trouver les préférences à ajouter
//            List<Preference> preferencesToAdd = preferenceRepository.findAllById(preferenceIds);
//
//            // Ajouter les préférences à l'utilisateur
//            for (Preference preference : preferencesToAdd) {
//                if (!user.getPreferences().contains(preference)) {
//                    user.getPreferences().add(preference);
//                    preference.getUsers().add(user);  // Assurer la relation bidirectionnelle
//                }
//            }
//
//            // Mettre à jour l'utilisateur
//            user.setHasSelectedPreferences(true);
//            return userRepository.save(user);
//        }
//        throw new RuntimeException("Utilisateur non authentifié.");
//    }

    public List<Preference> getPreferencesByCategory(PreferenceCategory category) {
        return preferenceRepository.findByCategory(category);
    }
    public User removePreferenceFromUser(Long userId, Long preferenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Preference preference = preferenceRepository.findById(preferenceId)
                .orElseThrow(() -> new RuntimeException("Preference not found"));

        // Remove the preference from the user
        if (user.getPreferences().contains(preference)) {
            user.getPreferences().remove(preference);
            preference.getUsers().remove(user);  // Maintain bidirectional relationship

            // If user has no preferences left, update the flag
            if (user.getPreferences().isEmpty()) {
                user.setHasSelectedPreferences(false);
            }

            userRepository.save(user);
            preferenceRepository.save(preference);  // Save the updated preference
        }

        return user;
    }
    public Long countUsersByPreference(Long preferenceId) {
        Preference preference = preferenceRepository.findById(preferenceId)
                .orElseThrow(() -> new RuntimeException("Preference not found with id: " + preferenceId));

        // Get the number of users associated with this preference
        return (long) preference.getUsers().size();
    }

}