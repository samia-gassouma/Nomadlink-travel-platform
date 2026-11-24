import { User } from "src/app/services/gestionUser/models";
import { Facture } from "./Facture";
import { Pack } from "./pack";


export class Paiement{
    id!: number;
    montant!: number;
    methode_paiement!: string;
    date_paiement!: Date;
    statut!: string;
    percent_off!: number;
    pack!: Pack;
    facture!:Facture;
    user!: User
}