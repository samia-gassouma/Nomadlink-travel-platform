import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/front-office/models/reservation.model';
import { switchMap, forkJoin, map ,catchError, of} from 'rxjs';
import { Vol } from '../../models/vol.model';
import { User } from '../../models/user.models';
import { FlightService } from 'src/app/front-office/services/flight/flight.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:9000/picloud/api/reservations';

  constructor(private http: HttpClient) {}

  createReservation(userId: number, volId: number, reservation: Reservation): Observable<Reservation> {
    const url = `http://localhost:9000/picloud/api/reservations/users/${userId}/vols/${volId}`;
    
    console.log('📡 URL API:', url);
    console.log('📡 Données envoyées:', reservation);
  
    return this.http.post<Reservation>(url, reservation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  
  
  // Obtenir toutes les réservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl).pipe(
      switchMap((reservations: Reservation[]) => {
        return forkJoin(reservations.map((reservation: Reservation) => {
          if (reservation.volId) { // Vérifie si la réservation concerne un vol
            return this.getFlightDetails(reservation.volId).pipe(
              map((vol: Vol) => ({
                ...reservation,
                vol: vol // ✅ Ajoute les détails du vol à la réservation
              }))
            );
          } else {
            return of(reservation);
          }
        }));
      })
    );
  }
  
  startPaypalPayment(amount: number): Observable<{ approvalUrl: string }> {
    const url = `http://localhost:9000/picloud/api/paypal/create-payment`;
  
    return this.http.post<{ approvalUrl: string }>(url, { amount }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  reserveEvent(userId: number, eventId: number, reservation: Reservation): Observable<Reservation> {
    const url = `http://localhost:9000/picloud/api/reservations/users/${userId}/events/${eventId}`;
    
    console.log('📡 URL API:', url);
    console.log('📡 Données envoyées:', reservation);
  
    return this.http.post<Reservation>(url, reservation, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  deleteReservation(reservationId: number): Observable<void> {
    const url = `${this.apiUrl}/${reservationId}`;
    console.log('📡 Suppression de la réservation avec ID:', reservationId);

    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  getAllwithname(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl).pipe(
      switchMap((reservations: Reservation[]) => {
        return forkJoin(reservations.map((reservation: Reservation) => {
          if (reservation.userId && reservation.volId) {
            return forkJoin([
              this.getUserDetails(reservation.userId).pipe(catchError(err => of(null))), // Catch error if user details fail
              this.getFlightDetails(reservation.volId).pipe(catchError(err => of(null)))  // Catch error if flight details fail
            ]).pipe(
              map(([user, vol]) => {
                return {
                  ...reservation,
                  userName: user?.username || 'Unknown',  // Fallback if user is null
                  flightDeparture: vol?.aeroportDepart || 'Unknown',  // Fallback if flight is null
                  flightArrival: vol?.aeroportArrivee || 'Unknown'  // Fallback if flight is null
                };
              })
            );
          } else {
            return of(reservation); // Handle case when userId or volId is undefined
          }
        }));
      })
    );
  }
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
  
  
  
  getUserDetails(userId: number): Observable<User> {
    return this.http.get<User>(`http://localhost:9000/picloud/api/users/${userId}`);
  }
  
  getFlightDetails(volId: number): Observable<Vol> {
    return this.http.get<Vol>(`http://localhost:9000/picloud/api/vols/${volId}`);
  }
  // Dans reservation.service.ts
getReservationStats(): Observable<any> {
  return this.getAllwithname().pipe(
    map(reservations => {
      // Calcul des statistiques côté client
      const stats = {
        totalReservations: reservations.length,
        confirmedCount: reservations.filter(r => r.statut === 'Confirmée').length,
        cancelledCount: reservations.filter(r => r.statut === 'Annulée').length,
        
        // Statistiques par mois (exemple)
        monthlyStats: this.calculateMonthlyStats(reservations),
        
        // Autres stats que vous pourriez vouloir
        mostPopularFlight: this.findMostPopularFlight(reservations)
      };
      return stats;
    })
  );
}

private calculateMonthlyStats(reservations: any[]): any {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  // Initialiser les compteurs pour chaque mois
  const monthlyCounts = new Array(12).fill(0);
  
  reservations.forEach(res => {
    if (res.dateReservation) {
      const date = new Date(res.dateReservation);
      if (date.getFullYear() === currentYear) {
        monthlyCounts[date.getMonth()]++;
      }
    }
  });
  
  return {
    labels: months,
    data: monthlyCounts
  };
}

private findMostPopularFlight(reservations: any[]): any {
  const flightCounts: {[key: string]: number} = {};
  
  reservations.forEach(res => {
    if (res.volId) {
      const key = `${res.flightDeparture} → ${res.flightArrival}`;
      flightCounts[key] = (flightCounts[key] || 0) + 1;
    }
  });
  
  let popularFlight = '';
  let maxCount = 0;
  
  for (const [flight, count] of Object.entries(flightCounts)) {
    if (count > maxCount) {
      popularFlight = flight;
      maxCount = count;
    }
  }
  
  return {
    route: popularFlight,
    count: maxCount
  };
}
  // Dans reservation.service.ts
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`).pipe(
      switchMap(reservation => {
        if (reservation.volId && !reservation.vol) {
          return this.getFlightDetails(reservation.volId).pipe( // ✅ Correction ici
            map(vol => ({
              ...reservation,
              vol: vol // ✅ Ajout des détails du vol à la réservation
            }))
          );
        }
        return of(reservation);
      })
    );
  }
  
  
// Adapter également getAllReservations() de manière similaire
}  