import { Commande } from './commande.model';

export enum StatutLivraison {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

export interface Livraison {
  id?: number; 
  commande: { id: number,nom?: string, prenom?: string };  
  dateEstimee?: Date;
  dateLivraisonEffective?: Date;
  adresseLivraison: string;
  statut: StatutLivraison;
  transporteur?: string;
}


