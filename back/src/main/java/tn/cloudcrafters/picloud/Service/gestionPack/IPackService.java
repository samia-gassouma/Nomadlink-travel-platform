package tn.cloudcrafters.picloud.Service.gestionPack;

import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;

import java.util.List;

public interface IPackService {
    Pack addPack(Pack pack);
    Pack updatePack(Pack pack);
    void deletePack(long id);
    List<Pack> getPacks();
    Pack getPack(long id);
    Pack getPackByName(String name);
}
