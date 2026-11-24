package tn.cloudcrafters.picloud.Entity.gestionImage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        // Créer le répertoire si nécessaire
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // Copier le fichier à la destination
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }


    public void deleteFile(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return; // Rien à supprimer si le nom du fichier est vide
        }

        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            // Si le fichier n'existe pas, on ne fait rien et on ne lance pas d'exception
        } catch (IOException e) {
            // Log l'erreur mais ne la propage pas pour éviter de bloquer le processus
            System.err.println("Erreur lors de la suppression du fichier " + fileName + ": " + e.getMessage());
        }
    }
}