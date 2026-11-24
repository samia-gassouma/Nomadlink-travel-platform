package tn.cloudcrafters.picloud.Repository.gestionPack;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionPack.Facture;

import java.util.List;

@Repository
public interface IFactureRepository extends CrudRepository<Facture,Long> {
    List<Facture> findFacturesByUser_Id(Long userId);
}
