import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsModule } from '../layouts/layouts.module';
import { DestinationService } from 'src/app/front-office/services/DestinationService';
import { ActivityService } from 'src/app/front-office/services/activity.service';
import { EventService } from 'src/app/front-office/services/event.service';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import { ChartsModule } from '../pages/charts/charts.module';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    LayoutsModule,
    MatCardModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  totalDestinations = 0;
  totalActivities = 0;
  totalEvents = 0;

  activityData: number[] = [];
  destinationLabels: string[] = [];

  constructor(
    private destinationService: DestinationService,
    private activityService: ActivityService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    forkJoin({
      destinations: this.destinationService.getAllDestinations(),
      activitiesCount: this.activityService.getActivitiesCountByDestination(),
      activities: this.activityService.getActivities(),
      events: this.eventService.getAllEvents()
    }).subscribe({
      next: ({ destinations, activitiesCount, activities, events }) => {
        this.totalDestinations = destinations.length;
        this.destinationLabels = Object.keys(activitiesCount);
        this.activityData = Object.values(activitiesCount);
        this.totalActivities = activities.length;
        this.totalEvents = events.length;
        
      },
      error: (err) => console.error('Error fetching data:', err)
    });
  }
}
