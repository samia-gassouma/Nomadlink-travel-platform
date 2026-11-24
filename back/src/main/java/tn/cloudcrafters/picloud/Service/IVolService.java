package tn.cloudcrafters.picloud.Service;

import org.springframework.web.multipart.MultipartFile;
import tn.cloudcrafters.picloud.Entity.Vol;

import java.io.IOException;
import java.util.List;

public interface IVolService {
    Vol ajouterVol(Vol vol);
    Vol modifierVol(Integer id, Vol vol);
    void supprimerVol(Integer id);
    Vol obtenirVolParId(Integer id);
    List<Vol> obtenirTousLesVols();
    String saveImage(MultipartFile file) throws IOException; // Méthode pour sauvegarder l'image

    Vol ajouterVolAvecImage(Vol vol, MultipartFile file) throws IOException;
}
