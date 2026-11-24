import { Injectable } from '@angular/core';
import { ReservationService } from 'src/app/front-office/services/reservation_flight/reservation.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {

  constructor(private reservationService: ReservationService) {}

  // Statistiques générales
  getGeneralStats() {
    return this.reservationService.getAllwithname().pipe(
      map(reservations => {
        return {
          total: reservations.length,
          confirmed: reservations.filter(r => r.statut === 'Confirmée').length,
          cancelled: reservations.filter(r => r.statut === 'Annulée').length,
        };
      })
    );
  }

  // Statistiques par compagnie aérienne
  getStatsByAirline() {
    return this.reservationService.getAllwithname().pipe(
      map(reservations => {
        const stats: {[key: string]: number} = {};
        
        reservations.forEach(res => {
          if (res.vol && res.vol.compagnie) {
            const compagnie = res.vol.compagnie;
            stats[compagnie] = (stats[compagnie] || 0) + 1;
          }
        });

        return Object.entries(stats).map(([name, count]) => ({ name, count }));
      })
    );
  }

  // Statistiques par destination
  getStatsByDestination() {
    return this.reservationService.getAllwithname().pipe(
      map(reservations => {
        const stats: {[key: string]: number} = {};
        
        reservations.forEach(res => {
          if (res.vol && res.vol.aeroportArrivee) {
            const destination = res.vol.aeroportArrivee;
            stats[destination] = (stats[destination] || 0) + 1;
          }
        });

        return Object.entries(stats).map(([name, count]) => ({ name, count }));
      })
    );
  }

  // Statistiques mensuelles
  getMonthlyStats() {
    return this.reservationService.getAllwithname().pipe(
      map(reservations => {
        const months = new Array(12).fill(0);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        reservations.forEach(res => {
          if (res.dateReservation) {
            const date = new Date(res.dateReservation);
            months[date.getMonth()]++;
          }
        });

        return {
          labels: monthNames,
          data: months
        };
      })
    );
  }
}