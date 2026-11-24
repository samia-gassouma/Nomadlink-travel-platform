package tn.cloudcrafters.picloud.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.Vol;
import tn.cloudcrafters.picloud.Repository.IVolRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class VolService implements IVolService {
    private static final String UPLOAD_DIR = "src/main/resources/static/images/";

    private final IVolRepository volRepository;

    // Injection via le constructeur
    @Autowired
    public VolService(IVolRepository volRepository) {
        this.volRepository = volRepository;
    }

    @Override
    public Vol ajouterVol(Vol vol) {
        // Vérifier si l'image est en base64
        if (vol.getImageUrl() != null && vol.getImageUrl().startsWith("data:image")) {
            String imageUrl = saveBase64Image(vol.getImageUrl());
            vol.setImageUrl(imageUrl); // Remplacer par le lien de l'image
        }

        return volRepository.save(vol);
    }

    // Sauvegarde une image reçue en Base64
    private String saveBase64Image(String base64String) {
        try {
            String base64Image = base64String.split(",")[1]; // Extraire les données base64 après la virgule
            byte[] decodedImage = Base64.getDecoder().decode(base64Image);

            // Générer un nom de fichier unique
            String fileName = UUID.randomUUID().toString() + ".png";
            Path path = Paths.get(UPLOAD_DIR, fileName);

            // Vérifier si le dossier existe, sinon le créer
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Sauvegarder le fichier
            Files.write(path, decodedImage);

            return "/images/" + fileName; // URL relative pour accéder à l'image
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la sauvegarde de l'image base64", e);
        }
    }

    // Sauvegarde une image reçue en MultipartFile
    public String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Générer un nom de fichier unique
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR, fileName);

        // Vérifier si le dossier existe, sinon le créer
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Sauvegarder le fichier
        Files.write(path, file.getBytes());

        return "/images/" + fileName; // URL relative pour accéder à l'image
    }

    @Override
    public Vol ajouterVolAvecImage(Vol vol, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("L'image est obligatoire");
        }

        // Sauvegarder l'image et obtenir l'URL
        String imageUrl = saveImage(file);
        vol.setImageUrl(imageUrl); // Associer l'URL de l'image au vol
        return volRepository.save(vol); // Sauvegarder le vol avec l'URL de l'image
    }
    @Override
    public Vol modifierVol(Integer id, Vol vol) {
        if (!volRepository.existsById(id)) {
            throw new RuntimeException("Vol non trouvé !");
        }
        vol.setIdVol(id);
        return volRepository.save(vol);
    }

    @Override
    public void supprimerVol(Integer id) {
        if (!volRepository.existsById(id)) {
            throw new RuntimeException("Vol non trouvé !");
        }
        volRepository.deleteById(id);
    }

    @Override
    public Vol obtenirVolParId(Integer id) {
        return volRepository.findById(id).orElseThrow(() -> new RuntimeException("Vol non trouvé !"));
    }

    @Override
    public List<Vol> obtenirTousLesVols() {
        return volRepository.findAll();
    }
}
