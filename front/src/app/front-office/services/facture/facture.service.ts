import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Facture } from '../../models/Facture';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private baseUrl = environment.apiBaseUrl;
  constructor(private _http: HttpClient) { }

  public findAll(): Observable<Facture[]>{
    return this._http.get<Facture[]>(this.baseUrl + `/getAllFacture`)
  }

  public findByUser(id: number): Observable<Facture[]>{
    return this._http.get<Facture[]>(this.baseUrl + `/getFactureByUser/${id}`)
  }

  public findById(id: number):Observable<Facture>{
    return this._http.get<Facture>(this.baseUrl+`/getFacture/${id}`)
  }

  public delete(id:number): Observable<void>{
    return this._http.delete<void>(this.baseUrl + `/deleteFacture/${id}`, { responseType: 'text' as 'json' });
  }

}
