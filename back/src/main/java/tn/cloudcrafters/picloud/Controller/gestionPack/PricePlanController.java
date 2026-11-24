package tn.cloudcrafters.picloud.Controller.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.PricePlan;
import tn.cloudcrafters.picloud.Service.gestionPack.PackService;
import tn.cloudcrafters.picloud.Service.gestionPack.PricePlanService;

import java.util.List;

@RestController
@RequestMapping("/price-plan")
public class PricePlanController {

    @Autowired
    private PricePlanService pricePlanService;

    @Autowired
    private PackService packService;

    @PostMapping("add/{id}")
    public PricePlan addPricePlan(@RequestBody PricePlan pricePlan,@PathVariable long id) {
        pricePlan.setPack(packService.getPack(id));
        return pricePlanService.createPricePlan(pricePlan);
    }

    @GetMapping("get/{id}")
    public PricePlan getPricePlan(@PathVariable long id) {
        return pricePlanService.getPricePlan(id);
    }

    @PutMapping("update/{id}")
    public PricePlan updatePricePlan(@RequestBody PricePlan pricePlan,@PathVariable long id) {
        pricePlan.setId(id);
        pricePlan.setPack(pricePlanService.getPricePlan(id).getPack());
        return pricePlanService.updatePricePlan(pricePlan);
    }

    @GetMapping("getAll")
    public List<PricePlan> getAll() {
        return pricePlanService.getAllPricePlan();
    }

    @DeleteMapping("delete/{id}")
    public void deletePricePlan(@PathVariable long id) {
        pricePlanService.deletePricePlan(id);
    }




}
