package tn.cloudcrafters.picloud.Service.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionPack.PricePlan;
import tn.cloudcrafters.picloud.Repository.gestionPack.IPricePlanRepository;

import java.util.List;

@Service
public class PricePlanService implements IPricePlanService {

    @Autowired
    IPricePlanRepository pricePlanRepository;


    @Override
    public PricePlan getPricePlan(long id) {
        return pricePlanRepository.findById(id).get();
    }

    @Override
    public PricePlan updatePricePlan(PricePlan pricePlan) {
        return pricePlanRepository.save(pricePlan);
    }

    @Override
    public PricePlan createPricePlan(PricePlan pricePlan) {
        return pricePlanRepository.save(pricePlan);
    }

    @Override
    public void deletePricePlan(long id) {
        pricePlanRepository.deleteById(id);
    }


    @Override
    public List<PricePlan> getAllPricePlan() {
        return (List<PricePlan>) pricePlanRepository.findAll();
    }

    @Override
    public List<PricePlan> getPricePlanByPack(long id) {
        return pricePlanRepository.getPricePlansByPack_Id(id);
    }
}
