import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from 'src/app/front-office/services/flight/flight.service';
import { Vol } from 'src/app/front-office/models/vol.model';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './editflight.component.html',
  styleUrls: ['./editflight.component.scss']
})
export class EditFlightComponent implements OnInit {
  flightId: string | null = null;  // Modifier le type de flightId en string

  flight: Vol = {
    idVol: 0,
    compagnie: '',
    numeroVol: '',
    aeroportDepart: '',
    aeroportArrivee: '',
    statut: 'Programmé',  // Valeur par défaut
    siegesDisponibles: 0,
    prix: 0,
    dateDepart: '',
    dateArrivee: '',
    dureeVol: 0,
    typeAvion: '',
    classe: 'Business',
    bagagesAutorises: ''
  };
  

  constructor(
    private route: ActivatedRoute,
    public flightService: FlightService,
    public router: Router  // Make router public
  ) { }

  ngOnInit(): void {
    // Récupère l'ID du vol à partir de l'URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.flightId = idParam;  // Assurer que flightId est une chaîne
        this.loadFlightDetails();
      } else {
        console.error('ID de vol manquant dans l\'URL');
      }
    });
    
  }

  // Charger les détails du vol
  loadFlightDetails(): void {
    this.flightService.getFlightById(this.flightId!).subscribe(
      (data: Vol) => {
        this.flight = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des détails du vol', error);
      }
    );
  }

  // Fonction pour soumettre les modifications du vol
  onSubmit(): void {
    if (!this.flight.numeroVol || !this.flight.compagnie) {
      console.error('Numéro de vol et compagnie sont obligatoires');
      return;  // Empêcher l'envoi si les champs sont manquants
    }
    if (this.flightId) {
      this.flightService.updateFlight(this.flightId.toString(), this.flight).subscribe(
        (response) => {
          console.log('Vol mis à jour avec succès:', response);
          this.router.navigate(['/listflight']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du vol:', error);
        }
      );
    }
  }
  
}
