package tn.cloudcrafters.picloud.Service.gestionPack;

import tn.cloudcrafters.picloud.Entity.gestionPack.PricePlan;

import java.util.List;

public interface IPricePlanService {
    PricePlan getPricePlan(long id);
    PricePlan updatePricePlan(PricePlan pricePlan);
    PricePlan createPricePlan(PricePlan pricePlan);
    void deletePricePlan(long id);
    List<PricePlan> getAllPricePlan();
    List<PricePlan> getPricePlanByPack(long id);


}
