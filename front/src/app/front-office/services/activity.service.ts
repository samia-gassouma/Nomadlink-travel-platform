import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
 
  private apiUrl = 'http://localhost:9000/picloud/api/activities'; // URL of your Spring Boot API

  constructor(private http: HttpClient) { }

  // Get the list of activities
  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }
  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateActivity(id: number, formData: FormData): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, formData);
  }

  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }
  getActivitiesCountByDestination(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(this.apiUrl);
  }

  public findByDestination(id:number): Observable<Activity[]>{
    return this.http.get<Activity[]>(`${this.apiUrl}/by-destination/${id}`);
  }


}
