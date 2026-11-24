package tn.cloudcrafters.picloud.Controller.gestionUser;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.gestionImage.FileStorageService;
import tn.cloudcrafters.picloud.Entity.gestionUser.Partner;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Service.gestionUser.PartnerService;

import java.io.IOException;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/partners")
public class PartnerController {

    @Autowired
    private PartnerService partnerService;

    private final FileStorageService fileStorageService;


    // Ajouter un partenaire
    @PostMapping("/add")
    public Partner addPartner(@RequestBody Partner partner) {
        return partnerService.addPartner(partner); // Appeler le service pour ajouter le partenaire
    }

//    @PutMapping("/update")
//    public Partner updatePartner(@RequestBody Partner partner) {
//        return partnerService.updatePartner(partner);
//    }
    @PutMapping("/update/{id}")
    public Partner updatePartner(@PathVariable("id") Long id, @RequestBody Partner partner) {
        return partnerService.updatePartner(id, partner); // Passer l'ID et les détails à mettre à jour
    }

    @GetMapping("/{id}")
    public Partner getPartnerById(@PathVariable("id") Long id) {
        return partnerService.getPartnerById(id);
    }

    @GetMapping("/all")
    public List<Partner> getAllPartners() {
        return partnerService.getAllPartners();
    }

    @DeleteMapping("/delete/{id}")
    public void deletePartner(@PathVariable("id") Long id) {
        partnerService.deletePartner(id);
    }




    // Add profile picture to existing user
    @PostMapping("/add/{userId}/profile-picture")
    public ResponseEntity<Partner> addProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            Partner updatedUser = partnerService.updateUserProfilePicture(userId, fileName);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{userId}/profile-picture")
    public ResponseEntity<Partner> updateProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            // Check if the user exists
            Partner existingpartner = partnerService.getPartnerById(userId);
            if (existingpartner == null) {
                return ResponseEntity.notFound().build();
            }

            // Delete the old picture if it exists
            if (existingpartner.getProfilePicture() != null && !existingpartner.getProfilePicture().isEmpty()) {
                fileStorageService.deleteFile(existingpartner.getProfilePicture());
            }

            // Store the new picture
            String fileName = fileStorageService.storeFile(file);
            Partner updatedUser = partnerService.updateUserProfilePicture(userId, fileName);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}