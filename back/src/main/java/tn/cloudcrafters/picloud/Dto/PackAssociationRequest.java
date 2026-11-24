package tn.cloudcrafters.picloud.Dto;

import lombok.Getter;
import lombok.Setter;
import tn.cloudcrafters.picloud.Entity.gestionPack.Pack;

import java.util.List;

@Getter
@Setter
public class PackAssociationRequest {
    private Pack pack;
    private Long destinationId;
    private List<Long> activityIds;
}
