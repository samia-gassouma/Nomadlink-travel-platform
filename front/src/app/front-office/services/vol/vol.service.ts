import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vol } from '../../models/Vol';

@Injectable({
  providedIn: 'root'
})
export class VolService {
private baseUrl = environment.apiBaseUrl;
  constructor(private _http:HttpClient) { }

   public findAll(): Observable<Vol[]>{
      return this._http.get<Vol[]>(`${this.baseUrl}/vol/getAll`);
    }
}
