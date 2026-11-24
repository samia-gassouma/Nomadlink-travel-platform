package tn.cloudcrafters.picloud.SecurityAll.auth;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Dto_gestionUser.CreateUserDTO;
import tn.cloudcrafters.picloud.Dto_gestionUser.PartnerDTO;
import tn.cloudcrafters.picloud.Entity.gestionImage.FileStorageService;
import tn.cloudcrafters.picloud.Entity.gestionUser.Partner;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Service.gestionUser.PartnerService;
import tn.cloudcrafters.picloud.Service.gestionUser.UserService;

import java.io.IOException;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
//@Tag(name = "Authentication")
public class AuthenticationController {

    private final AuthenticationService service;
    private final FileStorageService fileStorageService;
    private final PartnerService partnerservice;





    // ✅ Méthode pour créer un utilisateur
    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody CreateUserDTO createUserDTO) {
        User createdUser = service.createUser(createUserDTO);
        return ResponseEntity.ok(createdUser);
    }


    // Add profile picture to existing user
    @PostMapping("/user/{userId}/profile-picture")
    public ResponseEntity<User> addProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            User updatedUser = service.updateUserProfilePicture(userId, fileName);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Méthode pour créer un partenaire
    @PostMapping("/createpartner")
    public ResponseEntity<Partner> createPartner(@RequestBody PartnerDTO createPartnerDTO) {
        Partner createdPartner = service.createPartner(createPartnerDTO);
        return ResponseEntity.ok(createdPartner);
    }


    @PostMapping("/partner/{userId}/profile-picture")
    public ResponseEntity<Partner> addProfilePicturepartner(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            Partner updatedUser = partnerservice.updateUserProfilePicture(userId, fileName);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request
    ) throws MessagingException {
        service.register(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }
    @GetMapping("/activate-account")
    public void confirm(
            @RequestParam String token
    ) throws MessagingException {
        service.activateAccount(token);
    }
//    @PostMapping("/register-partner")
//    @ResponseStatus(HttpStatus.CREATED)
//    public ResponseEntity<?> registerPartner(
//            @RequestBody @Valid PartnerDTO request
//    ) throws MessagingException {
//        service.registerPartner(request);
//        return ResponseEntity.status(HttpStatus.CREATED).body("Partner registered successfully. Please check your email for activation.");
//    }

//    @PostMapping("/register-partner")
//    @ResponseStatus(HttpStatus.CREATED)
//    public ResponseEntity<?> registerPartner(
//            @RequestBody RegistrationPartnerRequest request
//    ) {
//        try {
//            service.registerPartner(request);
//            return ResponseEntity.status(HttpStatus.CREATED).body("Partner registered successfully. Please check your email for activation.");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }

    @GetMapping("/find-user-by-token")
    public ResponseEntity<User> findUserByToken(
            @RequestParam String token
    ) {
        User user = service.findUserByToken(token);
        return ResponseEntity.ok(user);
    }


    @GetMapping("/current-user")
    public ResponseEntity<User> getCurrentUser() {
        User user = service.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @GetMapping("/current-user-id")
    public ResponseEntity<Long> getCurrentUserId() {
        Long userId = service.getCurrentUserId();
        return ResponseEntity.ok(userId);
    }




    @PostMapping("/change")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            boolean changed = service.changePassword(
                    request.getUserId(),
                    request.getNewPassword()
            );

            if (changed) {
                return ResponseEntity.ok().body(new MessageResponse("Password changed successfully"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Password change failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody ResetPasswordRequest request) {
        try {
            service.sendPasswordResetEmail(request.getEmail());
            return ResponseEntity.ok().body(new MessageResponse("Password reset code sent to your email"));
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error sending email: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-confirm")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody ConfirmResetRequest request) {
        try {
            boolean reset = service.resetPassword(
                    request.getEmail(),
                    request.getResetCode(),
                    request.getNewPassword()
            );

            if (reset) {
                return ResponseEntity.ok().body(new MessageResponse("Password reset successfully"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Password reset failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}

// Request and response models
class ChangePasswordRequest {
    private Long userId;
    private String newPassword;

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}

class ResetPasswordRequest {
    private String email;

    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

class ConfirmResetRequest {
    private String email;
    private String resetCode;
    private String newPassword;

    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getResetCode() { return resetCode; }
    public void setResetCode(String resetCode) { this.resetCode = resetCode; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}

class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

