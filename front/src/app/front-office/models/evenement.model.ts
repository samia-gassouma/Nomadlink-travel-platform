import {Reservation} from "./reservation.model";

export interface Event {
  latitude: any;
  id_event: number;
  title: string;
  type: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  language: string;
  registrationFee: number;
  imageUrl: string;
  showWeather?: boolean; // Ajouté pour contrôler l'affichage
  weatherInfo?: any; // Ajouté pour stocker les données météo


  //idEvent: number;
  //nom: string;
  //date: string;
  //emplacement: string;
  prix: number;

  event:Reservation[]
}
