package tn.cloudcrafters.picloud.Service.gestionUser;



import tn.cloudcrafters.picloud.Entity.gestionUser.Admin;

import java.util.List;

public interface IAdminService {
    Admin addAdmin(Admin admin);
//    Admin updateAdmin(Admin admin);
    Admin updateAdmin(Long id, Admin adminDetails) ;

    Admin getAdminById(Long id);
    List<Admin> getAllAdmins();
    void deleteAdmin(Long id);
}
