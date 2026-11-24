package tn.cloudcrafters.picloud.Service.gestionUser;


import tn.cloudcrafters.picloud.Entity.gestionUser.User;

import java.util.List;

public interface IUserService {
    User addUser(User user);
//    User updateUser(User user);

    User updateUser(Long id, User user);


    User getUserById(Long id);
    List<User> getAllUsers();
    void deleteUser(Long id);
}