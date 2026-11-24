package tn.cloudcrafters.picloud.Service.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionPack.RewardPoints;
import tn.cloudcrafters.picloud.Repository.gestionPack.IRewardPointsRepository;

import java.util.List;

@Service
public class RewardPointsService implements IRewardPointsService {

    @Autowired
    private IRewardPointsRepository rewardPointsRepository;

    @Override
    public RewardPoints addRewardPoints(RewardPoints rewardPoints) {
        return rewardPointsRepository.save(rewardPoints);
    }

    @Override
    public RewardPoints getRewardPoints(long id) {
        return rewardPointsRepository.findById(id).get();
    }

    @Override
    public List<RewardPoints> getAllRewardPoints() {
        return (List<RewardPoints>) rewardPointsRepository.findAll();
    }

    @Override
    public RewardPoints getRewardPointsByUser(long id) {
        return rewardPointsRepository.findByUser_id(id);
    }

    @Override
    public RewardPoints updateRewardPoints(RewardPoints points){
        return rewardPointsRepository.save(points);
    }
}
