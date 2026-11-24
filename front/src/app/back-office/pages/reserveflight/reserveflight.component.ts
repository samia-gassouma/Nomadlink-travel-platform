import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/front-office/services/reservation_flight/reservation.service';
import { Reservation } from 'src/app/front-office/models/reservation.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Vol } from 'src/app/front-office/models/vol.model';
import { StatutReservation } from 'src/app/front-office/models/reservation.model';
import { LayoutsModule } from "../../layouts/layouts.module";
import { Event } from 'src/app/front-office/models/evenement.model';


@Component({
  selector: 'app-reserveflight',
  standalone: true,
  imports: [CommonModule, FormsModule ,
      LayoutsModule],
  templateUrl: './reserveflight.component.html',
  styleUrls: ['./reserveflight.component.scss']  // Adjust paths as needed
})

export class ReserveflightComponent implements OnInit {
  isLoading: boolean = true;
  error: string = '';
  reservations: (Reservation & { vol?: Vol })[] = []; // ✅ Typage propre
  StatutReservation = StatutReservation;

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllwithname().subscribe({
      next: (data) => {
        this.reservations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.error = 'Unable to fetch reservations. Please try again later.';
        this.isLoading = false;
      }
    });
    this.reservations = this.reservations.map(r => ({
      ...r,
      statut: r.statut || StatutReservation.Confirmée
    }));
    
    
  }

  updateReservation(reservation: Reservation): void {
    console.log('Edit reservation', reservation);
    this.router.navigate(['/front-office', 'edit-reservation', reservation.idReservation]);
  }

  deleteReservation(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        console.log('Reservation deleted');
        this.loadReservations();  // Recharger les réservations après suppression
      },
      error: (err) => {
        console.error('Error deleting reservation:', err);
        this.error = 'Unable to delete reservation. Please try again later.';
      }
    });
  }
  
  changeStatus(reservation: any): void {
    this.reservationService.updateStatus(reservation.idReservation, reservation.statut).subscribe({
      next: () => console.log('Statut mis à jour'),
      error: (err) => console.error('Erreur lors de la mise à jour du statut', err)
    });
  }
  formatPassportNumber(numeroPasseport: string): string {
    if (numeroPasseport && numeroPasseport.length > 4) {
      return '****' + numeroPasseport.slice(-4);
    }
    return numeroPasseport;  // Return the full number if it's less than or equal to 4 characters
  }
  
}
