import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/front-office/models/reservation.model';
import { event } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:9000/picloud/api/reservations';

  constructor(private http: HttpClient) {}

  createReservation(userId: number, eventId: number, reservation: Reservation): Observable<Reservation> {
    const url = `http://localhost:9000/picloud/api/reservations/users/${userId}/events/${eventId}`;
    
    console.log('📡 URL API:', url);
    console.log('📡 Données envoyées:', reservation);
  
    return this.http.post<Reservation>(url, reservation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  updateReservation(reservation: Reservation): Observable<Reservation> {
    const url = `${this.apiUrl}/${reservation.idReservation}`;
    return this.http.put<Reservation>(url, reservation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  
  
  // Obtenir toutes les réservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }
  startPaypalPayment(amount: number): Observable<{ approvalUrl: string }> {
    const url = `http://localhost:9000/picloud/api/paypal/create-payment`;
  
    return this.http.post<{ approvalUrl: string }>(url, { amount }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  reserveEvent(userId: number, eventId: number, reservation: any): Observable<any> {
    return this.http.post<any>(`http://localhost:9000/picloud/api/reservations/users/{{userId}}/events/{{eventId}}`, reservation);
  }
  
}
