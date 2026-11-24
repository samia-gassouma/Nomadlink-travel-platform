package tn.cloudcrafters.picloud.Controller.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Dto.DiscountRequest;
import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;
import tn.cloudcrafters.picloud.Entity.gestionPack.Discount;
import tn.cloudcrafters.picloud.Service.gestionPack.PackService;
import tn.cloudcrafters.picloud.Service.gestionPack.DiscountService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/discount")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @Autowired
    private PackService packService;

    @PostMapping("/add")
    public Discount addDiscount(@RequestBody DiscountRequest request) {
        Discount discount = new Discount();
        discount.setReduction_percent(request.getReduction_percent());
        discount.setDate_debut(request.getDate_debut());
        discount.setDate_fin(request.getDate_fin());

        Set<Pack> packs = new HashSet<>();
        for (Long packId : request.getPackIds()) {
            Pack pack = packService.getPack(packId);

            pack.setDiscount(discount); // set the discount in the pack
            packs.add(pack);
        }

        discount.setPacks(packs);
        return discountService.addDiscount(discount);
    }

    @GetMapping("/getAll")
    public List<Discount> getAllDiscounts() {
        return discountService.getDiscounts();
    }

    @GetMapping("getMaxDate")
    public String getMaxDate() {
        return discountService.getMaxDate().toString();
    }

    @GetMapping("/get/{id}")
    public Discount getDiscount(@PathVariable long id) {
        return discountService.getDiscount(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDiscount(@PathVariable long id) {
        discountService.removeDiscount(id);
    }

    @PutMapping("update/{id}")
    public Discount updateDiscount(@PathVariable long id, @RequestBody Discount discount) {
        discount.setId(id);
        return discountService.updateDiscount(discount);
    }
}

