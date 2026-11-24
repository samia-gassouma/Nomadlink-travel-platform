import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-destination-details',
  templateUrl: './destination-details.component.html',
  styleUrls: ['./destination-details.component.scss'],

 
  
 
})
export class DestinationDetailsComponent implements OnInit {
  idDestination: string | null = null;
  destinationDetails: any = null;
  imageGallery: string[] = [];
  bestTimeToVisit: string = '';
  mapLoaded: boolean = false;
  safeMapUrl: SafeResourceUrl;
  



constructor(
  private route: ActivatedRoute, 
  private sanitizer: DomSanitizer

) {
  this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
}
  ngOnInit(): void {
    // Récupérer l'id depuis les paramètres d'URL
    this.route.paramMap.subscribe(params => {
      this.idDestination = params.get('id');
      console.log('ID de destination:', this.idDestination);
      // Vous pouvez maintenant utiliser l'ID pour récupérer les détails de la destination
      // Par exemple, appeler un service pour obtenir les informations supplémentaires
    });
  }
}
