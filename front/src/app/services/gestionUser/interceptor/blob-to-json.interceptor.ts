import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {switchMap} from "rxjs/operators";

@Injectable()
export class BlobToJsonInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      switchMap((event: HttpEvent<any>) => {
        // Si l'événement est une HttpResponse et que le corps est un Blob
        if (event instanceof HttpResponse && event.body instanceof Blob) {
          return this.blobToJson(event.body).then((jsonResponse) => {
            // Cloner l'événement avec le corps JSON
            const clonedEvent = event.clone({ body: jsonResponse });
            return clonedEvent;
          }).catch((e) => {
            console.error('Failed to parse Blob as JSON', e);
            return event; // Retourner l'événement d'origine si la conversion échoue
          });
        }

        // Retourner l'événement original si ce n'est pas un HttpResponse ou si ce n'est pas un Blob
        return [event];  // Retourne un tableau d'événements pour être compatible avec switchMap
      })
    );
  }

  // Méthode pour lire le Blob et le convertir en JSON
  private blobToJson(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const jsonResponse = JSON.parse(reader.result as string);
          resolve(jsonResponse);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(blob);
    });
  }
}
