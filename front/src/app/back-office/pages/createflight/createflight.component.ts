import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlightService } from 'src/app/front-office/services/flight/flight.service';
import { Vol } from 'src/app/front-office/models/vol.model';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-createflight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createflight.component.html',
  styleUrl: './createflight.component.scss'
})
export class CreateflightComponent {

createVolForm: FormGroup;
  successMessage: string | null = null;

  totalVols: number = 0;
  volsAnnules: number = 0;
  volsAujourdhui: number = 0;

  constructor(private fb: FormBuilder, private flightService: FlightService) {
    this.createVolForm = this.fb.group({
      compagnie: ['', [Validators.required, Validators.minLength(2)]],
      numeroVol: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      aeroportDepart: ['', Validators.required],
      aeroportArrivee: ['', Validators.required],
      dateDepart: ['', Validators.required],
      dateArrivee: ['', Validators.required],
      dureeVol: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      typeAvion: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(1)]],
      siegesDisponibles: ['', [Validators.required, Validators.min(1)]],
      classe: ['', Validators.required],
      statut: ['', Validators.required],
      bagagesAutorises: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.flightService.getFlights().subscribe(vols => {
      this.totalVols = vols.length;
      this.volsAnnules = vols.filter(v => v.statut === 'Annulé').length;

      const today = new Date().toISOString().substring(0, 10);
      this.volsAujourdhui = vols.filter(v => v.statut === 'Programmé').length;
    });
  }

  submitForm() {
    if (this.createVolForm.valid) {
      const vol: Vol = this.createVolForm.value;

      // Correction des formats de dates
      vol.dateDepart = new Date(vol.dateDepart).toISOString().replace('T', ' ').substring(0, 16);
      vol.dateArrivee = new Date(vol.dateArrivee).toISOString().replace('T', ' ').substring(0, 16);

      this.flightService.createVol(vol).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Le vol a été créé avec succès.',
            timer: 2500,
            showConfirmButton: false
          });
          this.createVolForm.reset();
          this.loadStats();
        },
        error => {
          console.error('Erreur lors de la création du vol:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Une erreur est survenue lors de la création du vol. Veuillez vérifier les informations.'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire invalide',
        text: 'Veuillez remplir tous les champs requis.'
      });
    }
  }
}

