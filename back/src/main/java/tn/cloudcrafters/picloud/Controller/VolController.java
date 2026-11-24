package tn.cloudcrafters.picloud.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.Vol;
import tn.cloudcrafters.picloud.Service.IVolService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")  // Permet les requêtes depuis le front-end sur http://localhost:4200
@RestController
@RequestMapping("/api/vols")
public class VolController {

    @Autowired
    private IVolService volService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public VolController(IVolService volService) {
        this.volService = volService;

    }

    // Endpoint pour créer un vol avec image
    @PostMapping("/create")
    public ResponseEntity<Vol> createVol(@RequestBody Vol vol) {
        if (vol == null) {
            return ResponseEntity.badRequest().body(null);
        }

        System.out.println("✅ Objet reçu: " + vol.toString());

        try {
            Vol savedVol = volService.ajouterVol(vol);

            // Envoi d'une notification WebSocket
            messagingTemplate.convertAndSend("/topic/vols", savedVol);

            return ResponseEntity.ok(savedVol);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }



    // Autres méthodes pour gérer les vols
    @GetMapping("/{id}")
    public ResponseEntity<Vol> obtenirVolParId(@PathVariable Integer id) {
        return ResponseEntity.ok(volService.obtenirVolParId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vol> modifierVol(@PathVariable Integer id, @RequestBody Vol vol) {
        return ResponseEntity.ok(volService.modifierVol(id, vol));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> supprimerVol(@PathVariable Integer id) {
        volService.supprimerVol(id);
        return ResponseEntity.ok("Vol supprimé avec succès !");
    }

    @GetMapping
    public ResponseEntity<List<Vol>> obtenirTousLesVols() {
        return ResponseEntity.ok(volService.obtenirTousLesVols());
    }

    // Endpoint pour récupérer l'image d'un vol
    @GetMapping("/image/{imageName}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName) {
        String imagePath = "src/main/resources/static/images/" + imageName;
        Resource resource = new FileSystemResource(imagePath);

        if (resource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)  // Si c'est une image JPEG
                    .body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
