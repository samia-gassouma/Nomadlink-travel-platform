import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Commande} from "../../../models/boutique/commande.model";


@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:9000/picloud/api/commandes'; // Corrigé si l'URL concerne bien les commandes

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/all`);
  }

  passerCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/create`, commande);
  }

  // Récupérer une commande par son ID
  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/get/${id}`);
  }

  // Supprimer une commande
  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Mettre à jour une commande
  updateCommande(commande: Commande): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/update/${commande.id}`, commande);
  }
  getCommandesSansLivraison(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/commandes-sans-livraison`);
  }
  getCommandesLivrees(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/commandes-livrees`);
  }
  getPendingOrders(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/pending`);
  }
  
}
