import { Component, OnInit } from '@angular/core';
import { DestinationService } from '../../services/DestinationService';
import { Destination } from '../../models/destination.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-destination-list',
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.scss']
})
export class DestinationListComponent implements OnInit {
  destinations: Destination[] = [];

  constructor(private destinationService: DestinationService) { }

  ngOnInit(): void {
    this.getDestinations();
  }

  getDestinations(): void {
    this.destinationService.getAllDestinations().subscribe(
      (data) => {
        this.destinations = data;
        console.log("Activities récupérées :", this.destinations);  // 👈 Ajout ici

      },
      (error) => {
        console.error('Error fetching destinations', error);
      }
    );
  }

}