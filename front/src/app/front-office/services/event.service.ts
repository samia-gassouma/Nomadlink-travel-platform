import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from 'src/app/front-office/models/evenement.model';
import { Reservation} from "../models/reservation.model";

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = 'http://localhost:9000/picloud/api/events';

  constructor(private http: HttpClient) {}

  

  addEvent(eventData: FormData): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, eventData);
  }

  

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }
  deleteEvent(id_event: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:9000/picloud/api/events/${id_event}`);
  }
  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${eventId}`);
  }
  
  updateEvent(id_event: number, event: FormData): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id_event}`, event);
  }
  
  
  
}
