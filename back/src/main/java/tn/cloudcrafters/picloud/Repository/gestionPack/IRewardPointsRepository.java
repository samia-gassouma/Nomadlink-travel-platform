package tn.cloudcrafters.picloud.Repository.gestionPack;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionPack.RewardPoints;

@Repository
public interface IRewardPointsRepository extends CrudRepository<RewardPoints,Long> {
    RewardPoints findByUser_id(Long userId);
}
