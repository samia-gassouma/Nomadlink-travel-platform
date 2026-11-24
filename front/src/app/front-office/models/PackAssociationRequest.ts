import { Pack } from "./pack";


export interface PackAssociationRequest {
    pack: Pack;
    destinationId: number;
    activityIds: number[];
  }