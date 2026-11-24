import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Livraison} from "../../../models/boutique/livraison.model";


@Injectable({
  providedIn: 'root'
})
export class LivraisonService {

  private readonly apiUrl = 'http://localhost:9000/picloud/api/livraisons';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(this.apiUrl);
  }
  getLivraisonsLivrees(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/livrees`);
  }
  
  add(livraison: Livraison): Observable<Livraison> {
    return this.http.post<Livraison>(`${this.apiUrl}/create`, livraison);
  }

  getById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/${id}`);
  }


  getByCommandeId(commandeId: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/commande/${commandeId}`);
  }

  update(livraison: Livraison): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${livraison.id}`, livraison);
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  getUnassigned(): Observable<Livraison[]> {
     return this.http.get<Livraison[]>(`${this.apiUrl}/unassigned`);
 }
 getLivraisonsEnCours(): Observable<Livraison[]> {
  return this.http.get<Livraison[]>(`${this.apiUrl}/en-cours`);
}
updateLivraison(id: number, dateLivraisonEffective: Date): Observable<Livraison> {
  return this.http.put<Livraison>(`${this.apiUrl}/date-effective/${id}`, dateLivraisonEffective);
}

}
