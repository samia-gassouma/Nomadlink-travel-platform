export interface Vol {
  idVol?: number;
  compagnie: string;
  numeroVol: string;
  aeroportDepart: string;
  aeroportArrivee: string;
  dateDepart: string;
  dateArrivee: string;
  dureeVol: number;
  typeAvion: string;
  prix: number;
  siegesDisponibles: number;
  classe: 'Économie' | 'Business' | 'Première';
  statut: 'Programmé' | 'Retardé' | 'Annulé';
  bagagesAutorises: string;
  imageUrl?: string;
}

