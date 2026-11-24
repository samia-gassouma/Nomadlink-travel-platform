import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

// @Injectable()
// export class HttpResponseInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log('Outgoing request:', req.url, req);
//     return next.handle(req).pipe(
//         tap(
//             event => {
//               if (event instanceof HttpResponse) {
//                 console.log('Incoming response for', req.url, event);
//               }
//             },
//             error => {
//               console.error('Request error for', req.url, error);
//             }
//         )
//     );
//   }
// }
// Modify your HttpResponseInterceptor to better handle errors
@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('API Error:', error);
                // Handle unauthorized errors specifically
                if (error.status === 401) {
                    // Potentially redirect to login or refresh token
                    console.log('Unauthorized access - token may be invalid');
                }
                return throwError(error);
            })
        );
    }
}