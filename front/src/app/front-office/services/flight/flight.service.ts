import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Vol } from 'src/app/front-office/models/vol.model'; // Import du modèle Vol
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'http://localhost:9000/picloud/api/vols'; // URL de l'API backend

  // Stocker et partager les filtres
  private filtersSource = new BehaviorSubject<any>({});
  filters$ = this.filtersSource.asObservable();

  constructor(private http: HttpClient) {}

  // Récupérer tous les vols
  getFlights(): Observable<Vol[]> {
    return this.http.get<Vol[]>(this.apiUrl);
  }
  
  // Récupérer un vol par ID
  getFlightById(id: string): Observable<Vol> {
    return this.http.get<Vol>(`${this.apiUrl}/${id}`);
  }

  // Créer un vol
  createVol(vol: Vol): Observable<any> {
    const url = `${this.apiUrl}/create`;
    return this.http.post<any>(url, vol, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError((error) => {
        console.error('Error details:', error);
        throw error; // Re-throw the error after logging it
      })
    );
  }
  

  // Mettre à jour un vol
  updateFlight(id: string, vol: Vol): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Endpoint de mise à jour
    return this.http.put<any>(url, vol, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'  // Spécification du type JSON
      })
    });
  }

  // Supprimer un vol
  deleteFlight(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Endpoint de suppression
    return this.http.delete<any>(url);
  }

  // Stocker les filtres de recherche
  setFilters(filters: any) {
    this.filtersSource.next(filters);
  }

  // Simuler des données pour les filtres
  getStops() { return [{ title: 'Non-stop' }, { title: '1 Stop' }, { title: '2+ Stops' }]; }
  getRoutes() { return [{ title: 'Direct' }, { title: 'Connecting' }]; }
  getAmenities() { return [{ title: 'WiFi' }, { title: 'Extra Legroom' }]; }
  getAirlines() { return [{ title: 'Air France' }, { title: 'Lufthansa' }]; }
  getFlightTypes() { return [{ title: 'Economy' }, { title: 'Business' }]; }
  getAccommodations() { return [{ title: 'Standard' }, { title: 'Premium' }]; }



}
