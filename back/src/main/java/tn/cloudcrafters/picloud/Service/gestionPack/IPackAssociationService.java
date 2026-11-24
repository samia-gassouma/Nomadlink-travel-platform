package tn.cloudcrafters.picloud.Service.gestionPack;

import tn.cloudcrafters.picloud.Entity.gestionPack.PackAssociation;

import java.util.List;

public interface IPackAssociationService {

    PackAssociation addPackAssociation(PackAssociation packAssociation);
    PackAssociation getPackAssociation(Long packAssociationId);
    List<PackAssociation> getPackAssociationByPack(Long idPack);
    PackAssociation updatePackAssociation(PackAssociation packAssociation);
    void deletePackAssociation(Long packAssociationId);
    void deletePackAssociationsByPack(Long packId);
}
