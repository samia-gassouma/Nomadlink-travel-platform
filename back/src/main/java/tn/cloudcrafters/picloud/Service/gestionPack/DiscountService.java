package tn.cloudcrafters.picloud.Service.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionPack.Discount;
import tn.cloudcrafters.picloud.Repository.gestionPack.IDiscountRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiscountService implements IDiscountService {
    @Autowired
    private IDiscountRepository discountRepository;

    @Override
    public Discount getDiscount(long id) {
        return discountRepository.getDiscountById(id);
    }

    @Override
    public void setDiscount(Discount discount) {

    }

    public LocalDateTime getMaxDate() {
        return discountRepository.findMaxEndDate();
    }

    @Override
    public List<Discount> getDiscounts() {
        return (List<Discount>) discountRepository.findAll();
    }

    @Override
    public void setDiscounts(List<Discount> discounts) {

    }

    @Override
    public Discount addDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    @Override
    public void removeDiscount(long id) {
        discountRepository.deleteById(id);
    }

    @Override
    public Discount updateDiscount(Discount discount) {
        return discountRepository.save(discount);
    }
}
