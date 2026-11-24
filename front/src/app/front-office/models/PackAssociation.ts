import { Pack } from "./pack";
import {Destination} from "./destination.model";
import {Activity} from "./activity.model";

export class PackAssociation{
    id!:number;
    pack!:Pack;
    destination!:Destination;
    activities!: Activity[];
}