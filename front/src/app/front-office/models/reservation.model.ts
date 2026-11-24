import { Vol } from './vol.model';
import { Event } from './evenement.model';

export enum ModePaiement {
  Carte_bancaire = 'Carte_bancaire',
  PayPal = 'PayPal',
  Virement = 'Virement'
}

export enum StatutReservation {
  Confirmée = 'Confirmée',
  Annulée = 'Annulée',
  EnAttente = 'EnAttente'
}

// export interface Event {
//   // id_event: number;
//   // nom: string;
//   // date: string;
//   // type: string;
//   // depart: string;
//   // prix: number;
//   // emplacement: string;
//
//   latitude: any;
//   id_event: number;
//   title: string;
//   type: string;
//   description: string;
//   startDateTime: string;
//   endDateTime: string;
//   location: string;
//   language: string;
//   registrationFee: number;
//   imageUrl: string;
//
//
//   //idEvent: number;
//   //nom: string;
//   //date: string;
//   //emplacement: string;
//   prix: number;
//
//   event:Reservation[]
//
//
// }


export interface Reservation {
  idReservation?: number;
  userId: number;
  volId?: number;

  vol: Vol; // Ajoute cette ligne
  event: Event;

  eventId?: number;
  nomPassager: string;
  numeroPasseport: string;
  classe: string;
  prixPaye: number;
  modePaiement: ModePaiement;
  statut: StatutReservation;
  numeroSiege?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
  paypalEmail?: string;
  userName?: string;  
  flightId: number; 
  flightDeparture?: string; 
  flightArrival?: string; 
  email?: string; 
  numeroVol?: string;
  aeroportDepart?: string;
  aeroportArrivee?: string;
  dateReservation: string; // Assure-toi que cette propriété existe bien ici
  volDetails?: Vol; // ✅ Ajout de volDetails
}
