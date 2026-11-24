package tn.cloudcrafters.picloud.Repository.gestionPack;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionPack.PricePlan;

import java.util.List;

@Repository
public interface IPricePlanRepository extends CrudRepository<PricePlan, Long> {
    List<PricePlan> getPricePlansByPack_Id(Long packId);
}
