import { Pack } from "./pack";

export class Discount{
    id!:number;
    reduction_percent!:number;
    date_debut!:string;
    date_fin!: string;
    packs?: Pack[];
    packIds: number[];
    constructor(
        reduction_percent: number,
        date_debut: string,
        date_fin: string,
        packIds: number[] = []
      ) {
        this.reduction_percent = reduction_percent;
        this.date_debut = date_debut;
        this.date_fin = date_fin;
        this.packIds = packIds;
      }
}