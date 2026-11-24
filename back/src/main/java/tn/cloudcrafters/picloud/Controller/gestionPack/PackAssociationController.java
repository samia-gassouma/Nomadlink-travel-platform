package tn.cloudcrafters.picloud.Controller.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Dto.PackAssociationRequest;
import tn.cloudcrafters.picloud.Entity.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;
import tn.cloudcrafters.picloud.Entity.gestionPack.PackAssociation;
import tn.cloudcrafters.picloud.Service.*;
import tn.cloudcrafters.picloud.Service.gestionPack.PackService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/packAssociations")
public class PackAssociationController {

    @Autowired
    PackService packService;

    @Autowired
    DestinationService destinationService;

    @Autowired
    ActivityService activityService;

    @Autowired
    PackAssociationService packAssociationService;

    @Autowired
    VolService volService;

    @PostMapping("/add")
    public ResponseEntity<?> addAssociations(@RequestBody List<PackAssociationRequest> requests) {

        Pack pack = requests.get(0).getPack();
        pack.setVol(volService.obtenirVolParId(pack.getVol().getIdVol()));
        Pack savedPack = packService.addPack(pack);

        for (PackAssociationRequest req : requests) {
            Optional<Destination> dest = destinationService.getDestinationById(req.getDestinationId());

           List<Activity> activities = activityService.getActivitysById(req.getActivityIds());

            PackAssociation assoc = new PackAssociation();
            assoc.setPack(savedPack);
            assoc.setDestination(dest.get()); // ✅ ici on extrait la valeur
            assoc.setActivities(activities);

            packAssociationService.addPackAssociation(assoc);
        }

        return ResponseEntity.ok("All associations saved");
    }

    @GetMapping("/get/{id}")
    public PackAssociation getAssociations(@PathVariable Long id) {
        return packAssociationService.getPackAssociation(id);
    }

    @GetMapping("getByPack/{idPack}")
    public List<PackAssociation> getAssociationsByPack(@PathVariable Long idPack) {
        return packAssociationService.getPackAssociationByPack(idPack);
    }

    @PutMapping("/update/{idPack}")
    public List<PackAssociation> updateAssociations(@PathVariable Long idPack, @RequestBody List<PackAssociation> packAssociations) {

        Pack pack = packAssociations.get(0).getPack();
        packService.updatePack(pack);
        for (PackAssociation assoc : packAssociations) {
            packAssociationService.updatePackAssociation(assoc);
            System.out.println("assoc==="+assoc);
        }
        List<PackAssociation> existingAssociations = packAssociationService.getPackAssociationByPack(idPack);
        List<Long> incomingIds = packAssociations.stream()
                .map(PackAssociation::getId) // Assuming getId() returns the ID of the association
                .toList();

        // Find associations to delete (i.e., those in the DB but not in the incoming list)
        List<PackAssociation> toDelete = existingAssociations.stream()
                .filter(assoc -> !incomingIds.contains(assoc.getId()))
                .toList();

        // Delete associations that are not in the updated list
        for (PackAssociation assoc : toDelete) {
            packAssociationService.deletePackAssociation(assoc.getId());
            //System.out.println("Deleted assoc: " + assoc);
        }

        return packAssociationService.getPackAssociationByPack(idPack);
    }

    @DeleteMapping("/delete/{idPack}")
    public ResponseEntity<?> deleteAssociations(@PathVariable Long idPack) {
        packAssociationService.deletePackAssociationsByPack(idPack);
        return ResponseEntity.ok("Pack association deleted");
    }



}

