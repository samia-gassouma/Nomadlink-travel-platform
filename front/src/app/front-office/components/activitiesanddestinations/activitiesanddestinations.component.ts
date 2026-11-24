import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationService } from '../../services/DestinationService'; // Ton service pour récupérer les données

@Component({
  selector: 'app-activitiesanddestinations',
  templateUrl: './activitiesanddestinations.component.html',
  styleUrl: './activitiesanddestinations.component.scss'
})
export class ActivitiesanddestinationsComponent {
  destinationId!: string;
  activities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    // Récupère l'ID de la destination depuis l'URL
    this.destinationId = this.route.snapshot.paramMap.get('destinationId')!;
    this.loadActivities();
  }

  loadActivities(): void {
    const destinationIdAsNumber = Number(this.destinationId);
    this.destinationService.getActivitiesByDestinationId(destinationIdAsNumber).subscribe(
      (data) => {
        console.log(data);  // Log the fetched activities
        this.activities = data;
      },
      (error) => {
        console.error('Error loading activities', error);
      }
    );
  }
}  