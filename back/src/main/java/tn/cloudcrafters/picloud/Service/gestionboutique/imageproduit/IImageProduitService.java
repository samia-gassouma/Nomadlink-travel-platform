package tn.cloudcrafters.picloud.Service.gestionboutique.imageproduit;

import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.gestionboutique.ImageProduit;

import java.io.IOException;
import java.util.List;

public interface IImageProduitService {
    List<ImageProduit> getImagesByProduitId(Long produitId);
    ImageProduit uploadImage(Long produitId, MultipartFile file) throws IOException;
    void deleteImage(Long imageId);
}
