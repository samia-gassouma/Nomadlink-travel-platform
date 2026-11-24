import { Component, OnInit } from '@angular/core';
import { Destination } from 'src/app/front-office/models/destination.model';
import { DestinationService } from 'src/app/front-office/services/DestinationService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admindestination',
 
  templateUrl: './admindestination.component.html',
  styleUrl: './admindestination.component.scss'
})
export class AdmindestinationComponent implements OnInit {
   destinations: Destination[] = [];
   loading: boolean = false;
   errorMessage: string = '';

  
    constructor(private destinationService: DestinationService) { }
  
    ngOnInit(): void {
      this.getDestinations();
    }
  
    getDestinations(): void {
      this.loading = true;
      this.errorMessage = '';
    
      this.destinationService.getAllDestinations().subscribe(
        (data) => {
          this.destinations = data;
          console.log("Destinations récupérées :", this.destinations);  // Ajouté ici
          this.loading = false;
        }
        
        ,
        (error) => {
          console.error('Error fetching destinations', error);
          this.errorMessage = 'Erreur lors du chargement des destinations.';
          this.loading = false;
        }
      );
    
    
    }
    trackById(index: number, item: any): number {
      return item.id;
    }
    
    truncateText(text: string, limit: number): string {
      return text.length > limit ? text.substring(0, limit) + '...' : text;
    }
    
    deleteDestination(id?: number): void {
      if (id === undefined) {
        console.error("ID is undefined");
        return;
      }
    
      console.log("Attempting to delete destination with ID:", id);  // Log ajouté
    
      if (confirm("Are you sure you want to delete this destination?")) {
        this.destinationService.deleteDestination(id).subscribe(
          () => {
            setTimeout(() => {
              this.destinations = this.destinations.filter(dest => dest.id !== id);
              console.log("Destination deleted");
            }, 1000);  // Attends 1 seconde avant de filtrer les destinations
          },
          (error) => {
            console.error("Error deleting destination:", error);
          }
        );
      }
    }
    
    
    
  
  

}
