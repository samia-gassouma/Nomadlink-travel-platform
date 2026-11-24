import { ImageProduit } from "./imageproduct.model";

export interface Product {
    id: number;
    nom: string;
    prix: number;
    stock: number;
    categorie: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    reference?: string;
    prixAncien?: number;
    promotion?: number;
    images: ImageProduit[];
  }
  