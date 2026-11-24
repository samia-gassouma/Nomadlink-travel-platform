import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private baseUrl = 'http://localhost:9000/picloud/api/ia';

  constructor(private http: HttpClient) {}

  resumer(texte: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/resumer`, { texte }, { responseType: 'text' });
  }

  ideesProduit(category: string, description: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}/idees-produit`, {
      theme: category,
      description: description
    });
  }
  
  corriger(texte: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/corriger`, { texte }, { responseType: 'text' });
  }
}
