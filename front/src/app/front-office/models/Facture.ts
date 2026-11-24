import { User } from "src/app/services/gestionUser/models";
import { Paiement } from "./Paiement";


export class Facture{
    id!: number;
    date_emission!: Date;
    montant_total!: number;
    url!: string;
    user!: User;
    paiement!: Paiement;
}