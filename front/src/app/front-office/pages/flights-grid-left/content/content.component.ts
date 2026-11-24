import { Component, OnInit, Input } from '@angular/core';
import { FlightService } from 'src/app/front-office/services/flight/flight.service';
import { Vol } from 'src/app/front-office/models/vol.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  flights: Vol[] = []; // Liste des vols
  filteredFlights: Vol[] = []; // Vols filtrés
  initialSeats: { [key: number]: number } = {}; // ✅ Stocke les sièges initiaux
  @Input() updateStep!: (etape: string) => void;

  filters: any = {
    aeroportDepart: '',
    aeroportArrivee: '',
    classe: '',
    statut: '',
    dateDepart: '',
    dateArrivee: '',
    prix: null,
    compagnie: '',
    numeroVol: '',
    dureeVol: null,
    typeAvion: '',
    siegesDisponibles: null,
    bagagesAutorises: ''
  };
  
  page: number = 1;

  constructor(private flightService: FlightService, private router: Router) {}

  ngOnInit(): void {
    this.fetchFlights();
    this.updateStep('flight');
  }

  /** ✅ Récupérer les vols depuis l'API backend **/
  fetchFlights(): void {
    this.flightService.getFlights().subscribe(
      (data: Vol[]) => {
        this.flights = data;
        this.filteredFlights = data;
        
        // ✅ Vérifier que l'ID du vol est bien défini avant stockage
        this.flights.forEach(flight => {
          if (flight.idVol !== undefined) {
            this.initialSeats[flight.idVol] = flight.siegesDisponibles;
          }
        });

        console.log("🔄 Vols récupérés avec mise à jour des sièges !");
      },
      (error) => {
        console.error('❌ Erreur lors de la récupération des vols', error);
      }
    );
  }

  /** ✅ Appliquer les filtres de recherche **/
  applyFilters(): void {
    this.filteredFlights = this.flights.filter(flight =>
      (!this.filters.aeroportDepart || flight.aeroportDepart.toLowerCase().includes(this.filters.aeroportDepart.toLowerCase())) &&
      (!this.filters.aeroportArrivee || flight.aeroportArrivee.toLowerCase().includes(this.filters.aeroportArrivee.toLowerCase())) &&
      (!this.filters.compagnie || flight.compagnie.toLowerCase().includes(this.filters.compagnie.toLowerCase())) &&
      (!this.filters.numeroVol || flight.numeroVol.toLowerCase().includes(this.filters.numeroVol.toLowerCase())) &&
      (this.filters.dureeVol === null || flight.dureeVol === this.filters.dureeVol) &&
      (!this.filters.typeAvion || flight.typeAvion.toLowerCase().includes(this.filters.typeAvion.toLowerCase())) &&
      (this.filters.prix === null || flight.prix <= this.filters.prix) &&
      (!this.filters.classe || flight.classe.toLowerCase().includes(this.filters.classe.toLowerCase())) &&
      (!this.filters.statut || flight.statut.toLowerCase().includes(this.filters.statut.toLowerCase())) &&
      (!this.filters.dateDepart || flight.dateDepart.includes(this.filters.dateDepart)) &&
      (!this.filters.dateArrivee || flight.dateArrivee.includes(this.filters.dateArrivee)) &&
      (this.filters.siegesDisponibles === null || flight.siegesDisponibles >= this.filters.siegesDisponibles) &&
      (!this.filters.bagagesAutorises || flight.bagagesAutorises.toLowerCase().includes(this.filters.bagagesAutorises.toLowerCase()))
    );
  }

  /** ✅ Réinitialiser les filtres **/
  resetFilters(): void {
    this.filters = {
      aeroportDepart: '',
      aeroportArrivee: '',
      classe: '',
      statut: '',
      dateDepart: '',
      dateArrivee: '',
      prix: null,
      compagnie: '',
      numeroVol: '',
      dureeVol: null,
      typeAvion: '',
      siegesDisponibles: null,
      bagagesAutorises: ''
    };
    this.filteredFlights = this.flights;
  }

  /** ✅ Réserver un vol et mettre à jour les sièges **/
  reserveFlight(volId: number): void {
    this.router.navigate([`/reservation/flight/${volId}`]).then(() => {
      this.refreshFlights(); // ✅ Met à jour les vols après réservation
    });
  }

  /** ✅ Rafraîchir la liste des vols après réservation **/
  refreshFlights(): void {
    this.flightService.getFlights().subscribe(
      (data: Vol[]) => {
        this.flights = data;
        this.filteredFlights = data;
        
        console.log("🔄 Rafraîchissement des vols, sièges mis à jour !");
      },
      (error) => {
        console.error("❌ Erreur lors du rafraîchissement des vols :", error);
      }
    );
  }
}
