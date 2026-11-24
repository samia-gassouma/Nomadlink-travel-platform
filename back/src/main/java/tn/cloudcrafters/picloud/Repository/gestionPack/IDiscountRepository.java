package tn.cloudcrafters.picloud.Repository.gestionPack;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionPack.Discount;

import java.time.LocalDateTime;

@Repository
public interface IDiscountRepository extends CrudRepository<Discount, Long> {
    Discount getDiscountById(Long id);
    @Query("SELECT MAX(d.date_fin) FROM Discount d")
    LocalDateTime findMaxEndDate();

}
