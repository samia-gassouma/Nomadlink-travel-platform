package tn.cloudcrafters.picloud.Service.gestionUser;


import tn.cloudcrafters.picloud.Entity.gestionUser.Partner;

import java.util.List;

public interface IPartnerService {
    Partner addPartner(Partner partner);
//    Partner updatePartner(Partner partner);
    Partner updatePartner(Long id, Partner partnerDetails);

    Partner getPartnerById(Long id);
    List<Partner> getAllPartners();
    void deletePartner(Long id);
}