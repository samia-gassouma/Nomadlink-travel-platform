package tn.cloudcrafters.picloud.Service.gestionServices;



import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.cloudcrafters.picloud.Entity.gestionServices.ServiceCategory;
import tn.cloudcrafters.picloud.Entity.gestionServices.ServiceStatus;
import tn.cloudcrafters.picloud.Entity.gestionServices.Services;
import tn.cloudcrafters.picloud.Entity.gestionUser.Partner;
import tn.cloudcrafters.picloud.Entity.gestionUser.User;
import tn.cloudcrafters.picloud.Repository.gestionServices.ServiceRepository;
import tn.cloudcrafters.picloud.Repository.gestionUser.PartnerRepository;
import tn.cloudcrafters.picloud.Repository.gestionUser.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ServiceService implements IServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private UserRepository userRepository;
    @Override
    public Services addService(Services service) {
        return serviceRepository.save(service);
    }

    // Récupérer tous les services
    @Override
    public List<Services> getAllServices() {
        return serviceRepository.findAll();
    }


    // Récupérer un service par son ID
    @Override
    public Services getServiceById(Long id) {
        Optional<Services> service = serviceRepository.findById(id);
        return service.orElse(null);
    }

    // Créer un nouveau service avec l'ID du partenaire
    @Override
    public Services createService(Services service, Long partnerId) {
        Optional<Partner> partner = partnerRepository.findById(partnerId);
        if (partner.isPresent()) {
            service.setPartner(partner.get());
            return serviceRepository.save(service);
        }
        return null; // Ou vous pourriez lancer une exception si le partenaire n'existe pas
    }


    // Mettre à jour un service existant
    @Override
    public Services updateService(Long id, Services serviceDetails) {
        Optional<Services> service = serviceRepository.findById(id);
        if (service.isPresent()) {
            Services existingService = service.get();
            existingService.setName(serviceDetails.getName());
            existingService.setDescription(serviceDetails.getDescription());
            existingService.setPrice(serviceDetails.getPrice());
            existingService.setCategory(serviceDetails.getCategory());
            existingService.setStatus(serviceDetails.getStatus());
            existingService.setImageUrl(serviceDetails.getImageUrl());
            // Ne pas modifier le partenaire lors de la mise à jour
            return serviceRepository.save(existingService);
        }
        return null;
    }

    // Supprimer un service
    @Override
    @Transactional
    public boolean deleteService(Long id) {
        Optional<Services> serviceOpt = serviceRepository.findById(id);

        if (serviceOpt.isPresent()) {
            Services service = serviceOpt.get();

            // Détacher les utilisateurs de ce service avant la suppression
            if (service.getUsers() != null && !service.getUsers().isEmpty()) {
                for (User user : service.getUsers()) {
                    if (user.getSelectedServices() != null) {
                        user.getSelectedServices().remove(service);
                    }
                }
                service.getUsers().clear();
                serviceRepository.save(service); // Sauvegarder d'abord pour mettre à jour les relations
            }

            // Maintenant supprimer le service
            serviceRepository.deleteById(id);
            return true;
        }
        return false;
    }
    // Méthode pour supprimer tous les services d'un partenaire en toute sécurité
    @Transactional
    public void deleteAllServicesOfPartner(Long partnerId) {
        List<Services> services = serviceRepository.findByPartnerId(partnerId);

        for (Services service : services) {
            // Détacher chaque service de ses utilisateurs
            if (service.getUsers() != null) {
                for (User user : service.getUsers()) {
                    if (user.getSelectedServices() != null) {
                        user.getSelectedServices().remove(service);
                    }
                }
                service.getUsers().clear();
            }
        }

        // Sauvegarder les changements avant de supprimer
        serviceRepository.saveAll(services);

        // Maintenant supprimer tous les services
        serviceRepository.deleteAll(services);
    }


    // Récupérer tous les services d'un partenaire par son ID
    public List<Services> getAllServicesOfPartner(Long partnerId) {
        return serviceRepository.findByPartnerId(partnerId);
    }

    // Permettre à un utilisateur de sélectionner un service
    public boolean selectService(Long userId, Long serviceId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Services> service = serviceRepository.findById(serviceId);

        if (user.isPresent() && service.isPresent()) {
            Services foundService = service.get();
            User foundUser = user.get();

            // Vérifier si l'utilisateur a déjà sélectionné ce service
            List<User> users = foundService.getUsers();
            if (users == null) {
                users = new ArrayList<>();
                foundService.setUsers(users);
            }

            if (!users.contains(foundUser)) {
                users.add(foundUser);
                serviceRepository.save(foundService);
                return true;
            }
        }
        return false;
    }

    // Permettre à un utilisateur de désélectionner un service
    public boolean deselectService(Long userId, Long serviceId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Services> service = serviceRepository.findById(serviceId);

        if (user.isPresent() && service.isPresent()) {
            Services foundService = service.get();
            User foundUser = user.get();

            List<User> users = foundService.getUsers();
            if (users != null && users.contains(foundUser)) {
                users.remove(foundUser);
                serviceRepository.save(foundService);
                return true;
            }
        }
        return false;
    }

    // Récupérer tous les services sélectionnés par un utilisateur
    public List<Services> getSelectedServicesOfUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return serviceRepository.findByUsersContaining(user.get());
        }
        return new ArrayList<>();
    }

    public Services updateServiceImage(Long serviceId, String fileName) {
        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + serviceId));
        service.setImageUrl(fileName);
        return serviceRepository.save(service);
    }

    public List<User> getClientsOfPartner(Long partnerId) {
        // Get all services of this partner
        List<Services> partnerServices = serviceRepository.findByPartnerId(partnerId);

        // Use a Set to avoid duplicate users
        Set<User> clients = new HashSet<>();

        // For each service, add all users who have selected it
        for (Services service : partnerServices) {
            List<User> users = service.getUsers();
            if (users != null) {
                clients.addAll(users);
            }
        }

        // Convert Set back to List for return
        return clients.stream().collect(Collectors.toList());
    }

    // Récupérer tous les utilisateurs qui ont sélectionné un service spécifique
    public List<User> getUsersByService(Long serviceId) {
        Optional<Services> service = serviceRepository.findById(serviceId);
        if (service.isPresent() && service.get().getUsers() != null) {
            return service.get().getUsers();
        }
        return new ArrayList<>();
    }

    // Obtenir le nombre d'utilisateurs pour un service spécifique
    public int getUserCountForService(Long serviceId) {
        Optional<Services> service = serviceRepository.findById(serviceId);
        if (service.isPresent() && service.get().getUsers() != null) {
            return service.get().getUsers().size();
        }
        return 0;
    }
    // Obtenir le nombre de clients pour un partenaire
    public int getNumberOfClientsForPartner(Long partnerId) {
        List<User> clients = getClientsOfPartner(partnerId);
        return clients.size();
    }

    // Obtenir le nombre de services offerts par un partenaire
    public int getNumberOfServicesForPartner(Long partnerId) {
        List<Services> services = serviceRepository.findByPartnerId(partnerId);
        return services.size();
    }


}