package tn.cloudcrafters.picloud.Repository.gestionPack;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionPack.PackAssociation;

import java.util.List;

@Repository
public interface IPackAssociationRepository extends CrudRepository<PackAssociation,Long> {
    List<PackAssociation> findPackAssociationByPack_Id(Long packId);

    void deleteByPack_Id(Long packId);

    void deleteAllByPack_Id(Long packId);
}
