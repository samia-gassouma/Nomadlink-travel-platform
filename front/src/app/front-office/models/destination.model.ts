import {Activity} from "./activity.model";

export interface Destination {
  id?: number;
  name: string;
  description: string;
  country: string;
  type: string;
  climate: string;
  language: string;
  currency: string;
  mainImage: string;
  attractions: string[];
  locationMap: string;
  galleryImages: string[];
  visaRequired: boolean;
  safetyTips: string;
  bestTime: string[];
  idActivity: number;
  nom: string;
  mainImageUrl?: string;
  localisation: string;
  prix: number;
  duree: number;
  mapUrl?: string; // ✅ ajoute cette ligne
  lat?: number;  // Adding lat and lng as optional properties
  lng?: number;

  activites:Activity[]

}


