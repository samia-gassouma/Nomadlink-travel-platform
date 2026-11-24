import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paiement } from '../../models/Paiement';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  baseUrl = environment.apiBaseUrl;
  constructor(private _http: HttpClient) { }

  public checkout(type: string, name: string, price: number) :Observable<any>{
    const params = new HttpParams()
    .set('type', type)
    .set('name', name)
    .set('price', price);
    return this._http.post<any>(this.baseUrl+"/create-checkout-session", {}, {params});    
  }

  public findByUser(id:number): Observable<Paiement[]>{
    return this._http.get<Paiement[]>(this.baseUrl+`/getPaiementByUser/${id}`);
  }

  public findAll(): Observable<Paiement[]>{
    return this._http.get<Paiement[]>(this.baseUrl+"/getAllPaiement");
  }

  public findById(id: number): Observable<Paiement>{
    return this._http.get<Paiement>(this.baseUrl+`/getPaiement/${id}`);
  }

  public delete(id:number): Observable<void>{
    return this._http.delete<void>(this.baseUrl + `/deletePaiement/${id}`, { responseType: 'text' as 'json' });
  }
    
}
