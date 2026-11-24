import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationService } from 'src/app/front-office/services/DestinationService';
import { Activity } from 'src/app/front-office/models/activity.model';

@Component({
  selector: 'app-destination-activities',

  templateUrl: './destination-activities.component.html',
  styleUrl: './destination-activities.component.scss'
})

export class DestinationActivitiesComponent implements OnInit {
  destinationId: number = 0; // Initialisation avec une valeur par défaut
  activities: Activity[] = [];
  newActivity: Partial<Activity> = {}; // Utilisation de Partial pour les nouvelles activités
  showAddForm = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private destinationService: DestinationService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam && !isNaN(+idParam)) {
      this.destinationId = +idParam;
      this.loadActivities();
    } else {
      this.error = "ID de destination invalide ou non fourni";
    }
  }

  loadActivities(): void {
    this.isLoading = true;
    this.destinationService.getActivitiesByDestinationId(this.destinationId)
      .subscribe({
        next: (activities) => {
          this.activities = activities;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = "Erreur lors du chargement des activités";
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  addActivity(): void {
    if (!this.newActivity.activityName) {
      this.error = "Le nom de l'activité est requis";
      return;
    }

    this.isLoading = true;
    this.destinationService.addActivityToDestination(
      this.destinationId, 
      this.newActivity as Activity
    ).subscribe({
      next: (activity) => {
        this.activities.push(activity);
        this.newActivity = {};
        this.showAddForm = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Erreur lors de l'ajout de l'activité";
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}