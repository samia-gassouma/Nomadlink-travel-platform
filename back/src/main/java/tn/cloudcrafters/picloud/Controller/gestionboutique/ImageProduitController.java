package tn.cloudcrafters.picloud.Controller.gestionboutique;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.gestionboutique.ImageProduit;
import tn.cloudcrafters.picloud.Service.gestionboutique.imageproduit.IImageProduitService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class ImageProduitController {

    private final IImageProduitService imageService;

    @GetMapping("/produit/{produitId}")
    public List<ImageProduit> getImagesByProduit(@PathVariable Long produitId) {
        return imageService.getImagesByProduitId(produitId);
    }

    @PostMapping("/upload/{produitId}")
    public ResponseEntity<ImageProduit> uploadImage(@PathVariable Long produitId,
                                                    @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(imageService.uploadImage(produitId, file));
    }

    @DeleteMapping("/delete/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
