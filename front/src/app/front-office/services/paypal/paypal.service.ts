import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private baseUrl = 'http://localhost:9000/picloud/api/paypal'; // ✅ Assure-toi que l'URL est correcte

  constructor(private http: HttpClient) {}

  /** ✅ Créer un paiement PayPal et obtenir l’URL **/
  createPayment(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-payment`, { amount });
  }

  /** ✅ Capturer un paiement PayPal après succès **/
  capturePayment(paymentId: string, payerId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/capture-payment`, { paymentId, payerId });
  }
}
