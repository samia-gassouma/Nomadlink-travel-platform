package tn.cloudcrafters.picloud.Controller.gestionServices;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.gestionImage.FileStorageService;
import tn.cloudcrafters.picloud.Entity.gestionServices.ServiceCategory;
import tn.cloudcrafters.picloud.Entity.gestionServices.ServiceStatus;
import tn.cloudcrafters.picloud.Entity.gestionServices.Services;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Service.gestionServices.IServiceService;
import tn.cloudcrafters.picloud.Service.gestionServices.ServiceService;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@RestController
@AllArgsConstructor
@RequestMapping("/services")
public class ServiceController {

    @Autowired
    private ServiceService servicesService;
    private final FileStorageService fileStorageService;


    @PostMapping("/add")
    public Services addService(@RequestBody Services service) {
        return servicesService.addService(service);
    }


    // Récupérer tous les services
    @GetMapping("all")
    public ResponseEntity<List<Services>> getAllServices() {
        List<Services> services = servicesService.getAllServices();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    // Récupérer un service par son ID
    @GetMapping("getservice/{id}")
    public ResponseEntity<Services> getServiceById(@PathVariable Long id) {
        Services service = servicesService.getServiceById(id);
        if (service != null) {
            return new ResponseEntity<>(service, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Créer un nouveau service avec l'ID du partenaire
    @PostMapping("createservice/partner/{partnerId}")
    public ResponseEntity<Services> createService(@RequestBody Services service, @PathVariable Long partnerId) {
        Services createdService = servicesService.createService(service, partnerId);
        if (createdService != null) {
            return new ResponseEntity<>(createdService, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    // Mettre à jour un service existant
    @PutMapping("updateservice/{id}")
    public ResponseEntity<Services> updateService(@PathVariable Long id, @RequestBody Services serviceDetails) {
        Services updatedService = servicesService.updateService(id, serviceDetails);
        if (updatedService != null) {
            return new ResponseEntity<>(updatedService, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Supprimer un service
    @DeleteMapping("deleteservice/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        boolean deleted = servicesService.deleteService(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Récupérer tous les services d'un partenaire par son ID
    @GetMapping("/serviceofpartner/{partnerId}")
    public ResponseEntity<List<Services>> getAllServicesOfPartner(@PathVariable Long partnerId) {
        List<Services> services = servicesService.getAllServicesOfPartner(partnerId);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
    // Permettre à un utilisateur de sélectionner un service
    @PostMapping("/{serviceId}/selectbyuser/{userId}")
    public ResponseEntity<Void> selectService(@PathVariable Long serviceId, @PathVariable Long userId) {
        boolean selected = servicesService.selectService(userId, serviceId);
        if (selected) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    // Permettre à un utilisateur de désélectionner un service
    @PostMapping("/{serviceId}/deselectbyuser/{userId}")
    public ResponseEntity<Void> deselectService(@PathVariable Long serviceId, @PathVariable Long userId) {
        boolean deselected = servicesService.deselectService(userId, serviceId);
        if (deselected) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    // Récupérer tous les services sélectionnés par un utilisateur
    @GetMapping("/services-selected-byuser/{userId}")
    public ResponseEntity<List<Services>> getSelectedServicesOfUser(@PathVariable Long userId) {
        List<Services> services = servicesService.getSelectedServicesOfUser(userId);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
    @PostMapping("/add/{serviceId}/image")
    public ResponseEntity<Services> addServiceImage(
            @PathVariable Long serviceId,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            Services updatedService = servicesService.updateServiceImage(serviceId, fileName);
            return ResponseEntity.ok(updatedService);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{serviceId}/image")
    public ResponseEntity<Services> updateServiceImage(
            @PathVariable Long serviceId,
            @RequestParam("file") MultipartFile file) {
        try {
            // Vérifier si le service existe
            Services existingService = servicesService.getServiceById(serviceId);
            if (existingService == null) {
                return ResponseEntity.notFound().build();
            }

            // Supprimer l'ancienne image si elle existe
            if (existingService.getImageUrl() != null && !existingService.getImageUrl().isEmpty()) {
                fileStorageService.deleteFile(existingService.getImageUrl());
            }

            // Stocker la nouvelle image
            String fileName = fileStorageService.storeFile(file);
            Services updatedService = servicesService.updateServiceImage(serviceId, fileName);
            return ResponseEntity.ok(updatedService);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/clients-of-partner/{partnerId}")
    public ResponseEntity<List<User>> getClientsOfPartner(@PathVariable Long partnerId) {
        List<User> clients = servicesService.getClientsOfPartner(partnerId);
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    // Récupérer tous les utilisateurs qui ont sélectionné un service spécifique
    @GetMapping("/{serviceId}/users")
    public ResponseEntity<List<User>> getUsersByService(@PathVariable Long serviceId) {
        List<User> users = servicesService.getUsersByService(serviceId);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    // Endpoint pour obtenir le nombre d'utilisateurs pour un service spécifique
    @GetMapping("/{serviceId}/user-count")
    public ResponseEntity<Integer> getUserCountForService(@PathVariable Long serviceId) {
        int userCount = servicesService.getUserCountForService(serviceId);
        return new ResponseEntity<>(userCount, HttpStatus.OK);
    }
    // Endpoint pour obtenir le nombre de clients pour un partenaire
    @GetMapping("/partner/{partnerId}/client-count")
    public ResponseEntity<Integer> getClientCountForPartner(@PathVariable Long partnerId) {
        int clientCount = servicesService.getNumberOfClientsForPartner(partnerId);
        return new ResponseEntity<>(clientCount, HttpStatus.OK);
    }

    // Endpoint pour obtenir le nombre de services offerts par un partenaire
    @GetMapping("/partner/{partnerId}/service-count")
    public ResponseEntity<Integer> getServiceCountForPartner(@PathVariable Long partnerId) {
        int serviceCount = servicesService.getNumberOfServicesForPartner(partnerId);
        return new ResponseEntity<>(serviceCount, HttpStatus.OK);
    }


}