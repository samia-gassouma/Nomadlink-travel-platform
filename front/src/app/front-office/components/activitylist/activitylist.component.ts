import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activitylist',
  templateUrl: './activitylist.component.html',
  styleUrls: ['./activitylist.component.scss'],
})
export class ActivitylistComponent implements OnInit {
  activities: Activity[] = [];  // Array to store the activities
  loading: boolean = false;  // Loading state for activities
  errorMessage: string = '';  // Error message for fetching activities

  constructor(private activityService: ActivityService) { }

  ngOnInit(): void {
    this.fetchActivities();
  }

  fetchActivities(): void {
    this.loading = true;
    this.activityService.getActivities().subscribe({
      next: (data: Activity[]) => {
        this.activities = data;  // Store the fetched activities
        this.loading = false;  // Stop loading once data is fetched
      },
      error: (err) => {
        console.error('Error fetching activities', err);
        this.errorMessage = 'There was an error fetching the activities. Please try again later.';  // Display a user-friendly error message
        this.loading = false;  // Stop loading on error
      }
    });
  }
}