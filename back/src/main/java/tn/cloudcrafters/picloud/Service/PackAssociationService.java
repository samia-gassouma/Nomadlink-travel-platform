package tn.cloudcrafters.picloud.Service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionPack.PackAssociation;
import tn.cloudcrafters.picloud.Repository.gestionPack.IPackAssociationRepository;
import tn.cloudcrafters.picloud.Service.gestionPack.IPackAssociationService;

import java.util.List;

@Service
public class PackAssociationService implements IPackAssociationService {

    @Autowired
    IPackAssociationRepository packAssociationRepository;

    @Override
    public PackAssociation addPackAssociation(PackAssociation packAssociation) {
        return packAssociationRepository.save(packAssociation);
    }

    @Override
    public PackAssociation getPackAssociation(Long packAssociationId) {
        return packAssociationRepository.findById(packAssociationId).get();
    }

    @Override
    public List<PackAssociation> getPackAssociationByPack(Long idPack) {
        return packAssociationRepository.findPackAssociationByPack_Id(idPack);
    }

    @Override
    public PackAssociation updatePackAssociation(PackAssociation packAssociation) {
        return packAssociationRepository.save(packAssociation);
    }

    @Override
    public void deletePackAssociation(Long packAssociationId) {
        packAssociationRepository.deleteById(packAssociationId);
    }

    @Override
    @Transactional
    public void deletePackAssociationsByPack(Long packId) {
        packAssociationRepository.deleteAllByPack_Id(packId);
    }


}
