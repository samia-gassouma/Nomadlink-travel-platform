

import { Discount } from "./discount";
import { PricePlan } from "./PricePlan";
import { Vol } from "./Vol";

export class Pack {
    id!:number;
    packName!:string;
    packDescription!:string;
    packType!:PackType;
    packImage!:string;
    discount?: Discount;
    vol!:Vol;
    pricePlans?: PricePlan[];
}

export enum PackType {
    CULTURE = 'Culture',
    FESTIVAL = 'Festival',
    FAMILY = 'Family',
    ADVENTURE = 'Adventure',
    ECO_TOURISM = 'EcoTourism ',
    CRUISE = 'Cruise',

  }