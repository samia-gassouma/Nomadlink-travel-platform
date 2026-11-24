package tn.cloudcrafters.picloud.Service.gestionboutique.imageproduit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.gestionboutique.ImageProduit;
import tn.cloudcrafters.picloud.Entity.gestionboutique.Produit;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IImageProduitRepository;
import tn.cloudcrafters.picloud.Repository.gestionboutique.IProduitRepository;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageProduitService implements IImageProduitService {

    private final IImageProduitRepository imageProduitRepository;
    private final IProduitRepository produitRepository;

    @Override
    public List<ImageProduit> getImagesByProduitId(Long produitId) {
        return imageProduitRepository.findByProduitId(produitId);
    }

    @Override
    public ImageProduit uploadImage(Long produitId, MultipartFile file) throws IOException {
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new IllegalArgumentException("Produit avec ID " + produitId + " non trouvé."));

        ImageProduit image = new ImageProduit();
        image.setImage(file.getBytes()); // ⚠️ assure-toi que la méthode setImage(byte[]) existe
        image.setProduit(produit);

        return imageProduitRepository.save(image);
    }

    @Override
    public void deleteImage(Long imageId) {
        if (!imageProduitRepository.existsById(imageId)) {
            throw new IllegalArgumentException("Image avec ID " + imageId + " n'existe pas.");
        }
        imageProduitRepository.deleteById(imageId);
    }
}
