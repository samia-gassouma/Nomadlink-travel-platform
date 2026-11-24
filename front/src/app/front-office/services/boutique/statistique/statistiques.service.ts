import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {


  private baseUrl = 'http://localhost:9000/picloud/api/statistiques';

  constructor(private http: HttpClient) {}

  getAllStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/global`);
  }
}
