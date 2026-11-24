import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailApiUrl = 'http://localhost:9000/picloud/api/email/send'; // ✅ Vérifie bien que l'API existe
  private emailApiWithPdfUrl = 'http://localhost:9000/picloud/api/email/send-with-pdf'; // ✅ URL pour envoyer avec PDF

  constructor(private http: HttpClient) {}

  /** ✅ Envoyer un e-mail simple via le backend **/
  sendEmail(emailPayload: any): Observable<any> {
    return this.http.post<any>(this.emailApiUrl, emailPayload);
  }

  /** ✅ Envoyer un e-mail avec le PDF en pièce jointe **/
  sendEmailWithPDF(email: string, subject: string, body: string, pdfBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, 'confirmation_reservation.pdf'); // ✅ Ajout du PDF
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('body', body);

    return this.http.post<any>(this.emailApiWithPdfUrl, formData);
  }
}
