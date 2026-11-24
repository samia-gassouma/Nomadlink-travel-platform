import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/front-office/services/flight/flight.service';

@Component({
  selector: 'app-flights-grid-left',
  templateUrl: './flights-grid-left.component.html',
  styleUrls: ['./flights-grid-left.component.css']
})
export class FlightsGridLeftComponent implements OnInit {

  flights: any[] = []; // Liste des vols
  page: number = 1; // Gestion de la pagination

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.fetchFlights();
  }

  fetchFlights(): void {
    this.flightService.getFlights().subscribe(
      (data) => {
        console.log("Flights Data:", data);  // Vérifie ici que les données sont correctes
        
        // Ajouter un titre et une image par défaut pour chaque vol si manquant
        this.flights = data.map(flight => ({
          ...flight,
          title: flight.compagnie || 'No Title Available',  // Utilise 'compagnie' comme titre par défaut
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des vols', error);
      }
    );
  }
}
