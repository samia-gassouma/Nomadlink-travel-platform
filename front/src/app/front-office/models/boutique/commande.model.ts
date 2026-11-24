import { LigneCommande } from "./lignecommande.model";

export interface Commande {
  id?: number;
    nom: string;
    prenom: string;
    adresse: string;
    telephone: string;
    dateCommande: Date;
    statut: string;
    total: number;
    lignesCommande: LigneCommande[]; 
  }
  