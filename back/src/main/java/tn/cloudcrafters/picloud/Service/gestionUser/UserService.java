package tn.cloudcrafters.picloud.Service.gestionUser;


import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.cloudcrafters.picloud.Dto_gestionUser.CreateUserDTO;
import tn.cloudcrafters.picloud.Dto_gestionUser.UserDto;
import tn.cloudcrafters.picloud.Dto_gestionUser.UserMapper;
import tn.cloudcrafters.picloud.Entity.gestionPreferences.Preference;
import tn.cloudcrafters.picloud.Entity.gestionServices.Services;
import tn.cloudcrafters.picloud.Entity.gestionUser.ERole;
import tn.cloudcrafters.picloud.Entity.gestionUser.Role;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Repository.gestionUser.RoleRepository;
import tn.cloudcrafters.picloud.Repository.gestionUser.UserRepository;
import tn.cloudcrafters.picloud.SecurityAll.email.EmailService;
import tn.cloudcrafters.picloud.SecurityAll.tokens.Token;
import tn.cloudcrafters.picloud.SecurityAll.tokens.TokenRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor

public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    // Ajouter un utilisateur
    public User addUser(User user) {
        if (user.getRole() == null) {
            user.setRole(ERole.USER); // Rôle par défaut
        }
//        user.setCreatedAt(LocalDate.now());
//        user.setUpdatedAt(LocalDate.now());
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User updatedUser = existingUser.get();
            // Vous pouvez mettre à jour les champs nécessaires ici
            updatedUser.setFirstname(user.getFirstname());
            updatedUser.setLastname(user.getLastname());
            updatedUser.setEmail(user.getEmail());
            updatedUser.setPhoneNumber(user.getPhoneNumber());
            updatedUser.setAddress(user.getAddress());
            updatedUser.setCountry(user.getCountry());
            updatedUser.setDateOfBirth(user.getDateOfBirth());
            updatedUser.setGenre(user.getGenre());
            updatedUser.setProfilePicture(user.getProfilePicture());
//        updatedUser.setUpdatedAt(LocalDate.now());
            return userRepository.save(updatedUser);
        } else {
            return null; // ou vous pouvez lever une exception ici
        }
    }

//    public User updateUserbyadmin(Long id, UserDto userDto) {
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
//            user.setFirstname(userDto.getFirstName());
//            user.setLastname(userDto.getLastName());
//            user.setEmail(userDto.getEmail());
//            user.setPassword(passwordEncoder.encode(userDto.getPassword())); // encodage si nécessaire
//            user.setAddress(userDto.getAddress());
//            user.setPhoneNumber(userDto.getPhoneNumber());
//            user.setProfilePicture(userDto.getProfilePicture());
//            user.setDateOfBirth(userDto.getDateOfBirth());
//            user.setCountry(userDto.getCountry());
//            user.setGenre(userDto.getGenre());
//        return userRepository.save(user);
//    }


//    @Override
//    public User getUserById(Long id) {
//        return userRepository.findById(id).orElse(null);
//    }
    @Override
    public User getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        System.out.println("Fetching user with ID: " + id + ", Found: " + (user != null));
        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findByRole(ERole.USER);

//        return userRepository.findAll();
    }

//    @Override
//    public void deleteUser(Long id) {
//        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Supprimer l'utilisateur des rôles
//        for (Role role : user.getRoles()) {
//            role.getUsers().remove(user);
//        }
//
//        // Supprimer l'utilisateur des préférences
//        for (Preference preference : user.getPreferences()) {
//            preference.getUsers().remove(user);
//        }
//
//        // Maintenant supprimer l'utilisateur de la base de données
//        userRepository.delete(user);
//
//    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Supprimer l'utilisateur des rôles
        for (Role role : user.getRoles()) {
            role.getUsers().remove(user);
        }

        // Supprimer l'utilisateur des préférences
        for (Preference preference : user.getPreferences()) {
            preference.getUsers().remove(user);
        }

        // Supprimer l'utilisateur des services qu'il a sélectionnés
        if (user.getSelectedServices() != null) {
            List<Services> services = new ArrayList<>(user.getSelectedServices());
            for (Services service : services) {
                if (service.getUsers() != null) {
                    service.getUsers().remove(user);
                }
            }
            user.getSelectedServices().clear();
        }

        // Maintenant supprimer l'utilisateur de la base de données
        userRepository.delete(user);
    }

    public User updateUserProfilePicture(Long userId, String fileName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        user.setProfilePicture(fileName);
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }




}


