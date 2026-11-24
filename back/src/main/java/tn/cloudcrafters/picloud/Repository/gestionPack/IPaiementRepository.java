package tn.cloudcrafters.picloud.Repository.gestionPack;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionPack.Paiement;

import java.util.List;

@Repository
public interface IPaiementRepository extends CrudRepository<Paiement, Long> {
    List<Paiement> findPaiementByUser_Id(Long userId);
}
