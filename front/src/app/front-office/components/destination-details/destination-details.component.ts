import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationService } from '../../services/DestinationService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Destination } from '../../models/destination.model';
import { environment } from 'src/environments/environment'; // Assure-toi que c'est bien importé
@Component({
  selector: 'app-destination-details',
  templateUrl: './destination-details.component.html',
  styleUrls: ['./destination-details.component.scss']
})
export class DestinationDetailsComponent implements OnInit {
  destinationDetails!: Destination;
  imageGallery: string[] = [];
  safeMapUrl!: SafeResourceUrl;
  mapLoaded = false;
  bestTimeToVisit: string = '';

  constructor(
    private route: ActivatedRoute,
    private destinationService: DestinationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getDestinationDetails(id);
  }

  getDestinationDetails(id: number): void {
    this.destinationService.getDestinationById(id).subscribe(
      (data: Destination) => {
        this.destinationDetails = data;

        // Simuler la galerie d'images
        this.imageGallery = this.destinationDetails.galleryImages;

        // Créer l'URL de la carte en utilisant la clé API
        const query = encodeURIComponent(data.name);
        const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=${query}`;
        this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
        this.mapLoaded = true;

        // Simuler une logique pour la meilleure période
        this.bestTimeToVisit = data.bestTime.join(', ');
      },
      (error) => {
        console.error('Erreur lors du chargement des détails de la destination', error);
      }
    );
  }
}
