package tn.cloudcrafters.picloud.Service.gestionPack;

import tn.cloudcrafters.picloud.Entity.gestionPack.RewardPoints;

import java.util.List;

public interface IRewardPointsService {
    RewardPoints addRewardPoints(RewardPoints rewardPoints);
    RewardPoints getRewardPoints(long id);
    List<RewardPoints> getAllRewardPoints();
    RewardPoints getRewardPointsByUser(long id);
    RewardPoints updateRewardPoints(RewardPoints points);
}
