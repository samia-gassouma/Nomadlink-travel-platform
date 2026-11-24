import { Component } from '@angular/core';
import { ActivityService } from 'src/app/front-office/services/activity.service';
import { Activity } from 'src/app/front-office/models/activity.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DestinationService } from 'src/app/front-office/services/DestinationService';
import { Destination } from 'src/app/front-office/models/destination.model';

@Component({
  selector: 'app-adminactivity',

  templateUrl: './adminactivity.component.html',
  styleUrl: './adminactivity.component.scss'
})
export class AdminactivityComponent {
   activities: Activity[] = [];  // Array to store the activities
    loading: boolean = false;  // Loading state for activities
    errorMessage: string = '';  // Error message for fetching activities
    destinations: Destination[] = [];
  
    constructor(private activityService: ActivityService, private router:Router,  private destinationService: DestinationService) { }
   // Edit activity handler
   editActivity(activity: Activity): void {
    this.router.navigate(['/back-office/edit-activity', activity.id]);
  }
  // Delete activity handler
  deleteActivity(id?: number): void {
    if (!id) {
      console.error("ID is undefined");
      return;
    }
  
    if (confirm("Are you sure you want to delete this activity?")) {
      this.activityService.deleteActivity(id).subscribe({
        next: () => {
          this.activities = this.activities.filter(activity => activity.id !== id);
          console.log("Activity deleted");
        },
        error: (error) => {
          console.error("Error deleting activity:", error);
        }
      });
    }
  }
  
  

    ngOnInit(): void {
      this.fetchActivities();
      this.loadDestinations();


    }
    loadDestinations(): void {
      this.destinationService.getAllDestinations().subscribe({
        next: (data) => this.destinations = data,
        error: (err) => console.error('Erreur lors du chargement des destinations:', err)
      });
    }
  
    getDestinationName(id?: number): string {
      return this.destinations.find(dest => dest.id === id)?.name || 'Unknown';
    }
    fetchActivities(): void {
      this.loading = true;
      this.activityService.getActivities().subscribe({
        next: (data: Activity[]) => {
          this.activities = data;  
          console.log("Activities récupérées :", this.activities);  // 👈 Ajout ici
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching activities', err);
          this.errorMessage = 'There was an error fetching the activities. Please try again later.';
          this.loading = false;
        }
      });
    }
  }    

