package tn.cloudcrafters.picloud.Controller.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.RewardPoints;
import tn.cloudcrafters.picloud.Service.gestionPack.RewardPointsService;
import tn.cloudcrafters.picloud.Service.gestionUser.UserService;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("reward-points")
public class RewardPointsController {

    @Autowired
    private RewardPointsService rewardPointsService;

    @Autowired
    private UserService userService;


    @GetMapping("get/{id_user}")
    public RewardPoints getRewardPoints(@PathVariable int id_user) {
        return rewardPointsService.getRewardPointsByUser(id_user);
    }

    @GetMapping("getAll")
    public List<RewardPoints> getAllRewardPoints() {
        return rewardPointsService.getAllRewardPoints();
    }

    @PostMapping("add/{id}")
    public RewardPoints addRewardPoints(@PathVariable long id) {

        RewardPoints rewardPoints = new RewardPoints();
        rewardPoints.setPoints(100);
        rewardPoints.setValue((float) 10);
        rewardPoints.setUpdated_at(new Date());
        rewardPoints.setIs_active(true);
        rewardPoints.setUser(userService.getUserById(id));
        return rewardPointsService.addRewardPoints(rewardPoints);
    }

    @PatchMapping("/update")
    public RewardPoints updateRewardPoints(RewardPoints rewardPoints) {
        return rewardPointsService.updateRewardPoints( rewardPoints);
    }
}
