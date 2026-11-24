import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Destination } from '../models/destination.model';
import { Activity } from '../models/activity.model';
@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = 'http://localhost:9000/picloud/api/destinations';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les destinations
  getAllDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.apiUrl);
  }

  addDestination(destination: any): Observable<any> {
    return this.http.post(this.apiUrl, destination);
  }
  updateDestinationFormData(id: number, formData: FormData) {
    return this.http.put(`http://localhost:9000/picloud/api/destinations/${id}`, formData);
  }
  
  // Récupérer une destination par son ID
  getDestinationById(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/${id}`);
  }
  deleteDestination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getActivitiesByDestinationId(destinationId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/${destinationId}/activities`);
  }

  addActivityToDestination(destinationId: number, activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/${destinationId}/activities`, activity);
  }

  
}