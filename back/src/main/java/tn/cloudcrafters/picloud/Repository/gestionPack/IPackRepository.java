package tn.cloudcrafters.picloud.Repository.gestionPack;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;

@Repository
public interface IPackRepository extends CrudRepository<Pack, Long> {
    Pack findPackByPackName(String packName);
}
