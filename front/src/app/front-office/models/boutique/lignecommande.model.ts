import { ImageProduit } from "./imageproduct.model";

// ligne-commande.model.ts
export interface LigneCommande {
    id?: number;
    quantite: number;
    prixUnitaire: number;
    produit: {
      id: number; 
      nom?: string;
      images?: ImageProduit[];
    };
  }
  