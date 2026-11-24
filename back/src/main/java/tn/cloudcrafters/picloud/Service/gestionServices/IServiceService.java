package tn.cloudcrafters.picloud.Service.gestionServices;




import tn.cloudcrafters.picloud.Entity.gestionServices.Services;

import java.util.List;

public interface IServiceService {

    public List<Services> getAllServices() ;
    public Services getServiceById(Long id) ;
    public Services createService(Services service, Long partnerId) ;

    public Services updateService(Long id, Services serviceDetails) ;

    public boolean deleteService(Long id) ;

//    List<Services> retrieveServices();
//    Services updateService(long idService, Services updatedService) ;
    Services addService(Services service);
//    Services retrieveService(long idService);
//    void removeService(long idService);
}