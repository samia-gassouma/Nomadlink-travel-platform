import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable, Observer } from 'rxjs';  // Ajout de l'import pour Observer
import { Vol } from 'src/app/front-office/models/vol.model'; // Import du modèle Vol

export class WebsocketService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://localhost:9000/ws');
  }

  // Exemple de méthode pour recevoir des notifications de vol
  getFlightNotifications(): Observable<Vol> {
    return new Observable((observer: Observer<Vol>) => {
      this.socket.onmessage = (event) => {
        // Ici, tu pars du principe que l'événement contient un objet Vol en JSON
        const flightData: Vol = JSON.parse(event.data);
        observer.next(flightData); // Envoie les données sous forme d'objet Vol
      };
      this.socket.onerror = (error) => {
        observer.error(error);
      };
      this.socket.onclose = () => {
        observer.complete();
      };
    });
  }
}
