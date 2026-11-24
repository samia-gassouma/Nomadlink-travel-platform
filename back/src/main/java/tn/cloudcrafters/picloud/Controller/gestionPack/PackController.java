package tn.cloudcrafters.picloud.Controller.gestionPack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;
import tn.cloudcrafters.picloud.Service.gestionPack.PackService;

import java.util.List;

@RestController
@RequestMapping("/pack")
public class PackController {
    @Autowired
    private PackService packService;

    @GetMapping("/getAll")
    public List<Pack> getAll(){
        return packService.getPacks();
    }

    @PostMapping("add")
    public Pack add(@RequestBody Pack pack){
        return packService.addPack(pack);
    }

    @GetMapping("get/{id}")
    public Pack get(@PathVariable int id){
        return packService.getPack(id);
    }

}
