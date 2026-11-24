package tn.cloudcrafters.picloud.Controller.gestionUser;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Dto_gestionUser.UserDto;
import tn.cloudcrafters.picloud.Dto_gestionUser.UserMapper;
import tn.cloudcrafters.picloud.Entity.gestionImage.FileStorageService;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Service.gestionUser.UserService;

import java.io.IOException;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController{
    @Autowired
    private UserService userService;

    private final FileStorageService fileStorageService;


    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }





    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
//    @PutMapping("/update_user/{id}")
//    public User updateUserbyadmin(@PathVariable Long id, @RequestBody UserDto dto) {
//        return userService.updateUserbyadmin(id, dto);
//    }

    @GetMapping("/{id}/details")
    public UserDto getUserDetailsById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return null;
        }
        // Utiliser le UserMapper pour convertir l'utilisateur en UserDto complet
        UserDto dto = UserMapper.toUserDTO(user);
        return dto;
    }

    // Add profile picture to existing user
    @PostMapping("/add/{userId}/profile-picture")
    public ResponseEntity<User> addProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            User updatedUser = userService.updateUserProfilePicture(userId, fileName);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{userId}/profile-picture")
    public ResponseEntity<User> updateProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            // Check if the user exists
            User existingUser = userService.getUserById(userId);
            if (existingUser == null) {
                return ResponseEntity.notFound().build();
            }

            // Delete the old picture if it exists
            if (existingUser.getProfilePicture() != null && !existingUser.getProfilePicture().isEmpty()) {
                fileStorageService.deleteFile(existingUser.getProfilePicture());
            }

            // Store the new picture
            String fileName = fileStorageService.storeFile(file);
            User updatedUser = userService.updateUserProfilePicture(userId, fileName);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




    // Update existing user's profile picture
//    @PutMapping("/user/{userId}/profile-picture")
//    public ResponseEntity<User> updateProfilePicture(
//            @PathVariable Long userId,
//            @RequestParam("file") MultipartFile file) {
//        try {
//            // Vérifier si l'utilisateur existe
//            User existingUser = userService.getUserById(userId);
//            if (existingUser == null) {
//                return ResponseEntity.notFound().build();
//            }
//
//            // Supprimer l'ancienne photo si elle existe
//            if (existingUser.getProfilePicture() != null) {
//                fileStorageService.deleteFile(existingUser.getProfilePicture());
//            }
//
//            // Enregistrer la nouvelle photo
//            String fileName = fileStorageService.storeFile(file);
//            User updatedUser = userService.updateUserProfilePicture(userId, fileName);
//            return ResponseEntity.ok(updatedUser);
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
//


//    @PostMapping("/{id}/profile-picture")
//    public ResponseEntity<UserDto> uploadProfilePicture(
//            @PathVariable Long id,
//            @RequestParam("file") MultipartFile file) {
//        try {
//            User updatedUser = userService.updateProfilePicture(id, file);
//            return ResponseEntity.ok(UserMapper.toUserDTO(updatedUser));
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

}