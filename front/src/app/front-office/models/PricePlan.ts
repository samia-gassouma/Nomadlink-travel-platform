import { Pack } from "./pack";

export class PricePlan{
    id!:number;
    description!:string;
    name!:PricePlanType;
    price!:number;
    pack?:Pack
}

export enum PricePlanType {
    Basic = 'Basic',
    Standard = 'Standard',
    Advanced = 'Advanced',
    Premium = 'Premium',
  }
  