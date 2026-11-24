package tn.cloudcrafters.picloud.Controller.gestionUser;



import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.cloudcrafters.picloud.Entity.gestionUser.Admin;
import tn.cloudcrafters.picloud.Service.gestionUser.AdminService;

import java.util.List;

@RestController
@RequestMapping("/admins")
@AllArgsConstructor

public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/add")
    public Admin addAdmin(@RequestBody Admin admin) {
        return adminService.addAdmin(admin);
    }
//    @PutMapping("/update")
//    public Admin updateAdmin(@RequestBody Admin admin) {
//        return adminService.updateAdmin(admin);
//    }

    @PutMapping("/update/{id}")
    public Admin updateAdmin(@PathVariable("id") Long id, @RequestBody Admin admin) {
        return adminService.updateAdmin(id, admin);
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable("id") Long id) {
        return adminService.getAdminById(id);
    }

    @GetMapping("/all")
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteAdmin(@PathVariable("id") Long id) {
        adminService.deleteAdmin(id);
    }

}