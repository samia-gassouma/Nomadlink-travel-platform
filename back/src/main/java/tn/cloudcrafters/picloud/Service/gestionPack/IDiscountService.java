package tn.cloudcrafters.picloud.Service.gestionPack;

import tn.cloudcrafters.picloud.Entity.gestionPack.Discount;

import java.util.List;

public interface IDiscountService {
    Discount getDiscount(long id);
    void setDiscount(Discount discount);
    List<Discount> getDiscounts();
    void setDiscounts(List<Discount> discounts);
    Discount addDiscount(Discount discount);
    void removeDiscount(long id);
    Discount updateDiscount(Discount discount);
}
