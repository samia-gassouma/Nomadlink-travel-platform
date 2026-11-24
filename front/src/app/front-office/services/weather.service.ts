import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey = 'a9814270e406491bb6e51400252904'; // Remplacez par votre clé API
  private apiUrl = 'https://api.weatherapi.com/v1/current.json';

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${city}`;
    return this.http.get<any>(url);
  }
}
