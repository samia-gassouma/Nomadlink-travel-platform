package tn.cloudcrafters.picloud.Service.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;
import tn.cloudcrafters.picloud.Repository.gestionPack.IPackRepository;
import tn.cloudcrafters.picloud.Repository.gestionPack.IDiscountRepository;
import tn.cloudcrafters.picloud.Repository.IVolRepository;

import java.util.List;

@Service
public class PackService implements IPackService {
    @Autowired
    private IPackRepository packRepository;

    @Autowired
    private IDiscountRepository discountRepository;

    @Autowired
    private IVolRepository volRepository;


    @Override
    public Pack addPack(Pack pack) {
        if(pack.getDiscount() != null){
            discountRepository.save(pack.getDiscount());
        }
        return packRepository.save(pack);
    }

    @Override
    public Pack updatePack(Pack pack) {
        //Pack existingPack = packRepository.findById(pack.getId())
          //      .orElseThrow(() -> new RuntimeException("Pack not found"));

        // Manually copy the fields you want to update
        //existingPack.setPackName(pack.getPackName());
        //existingPack.setPackDescription(pack.getPackDescription());
        //existingPack.setPricePlans(pack.getPricePlans());
        // existingPack.setVol(pack.getVol());
       // Vol vol = volRepository.findById(pack.getVol().getIdVol()).get();
       // vol.getPack().add(existingPack);
        // ... any other fields

        return packRepository.save(pack);
    }

    @Override
    public void deletePack(long id) {
        packRepository.deleteById(id);
    }

    @Override
    public List<Pack> getPacks() {
        return (List<Pack>) packRepository.findAll();
    }

    @Override
    public Pack getPack(long id) {
        return packRepository.findById(id).get();
    }

    @Override
    public Pack getPackByName(String name) {
        return packRepository.findPackByPackName(name);
    }

}
