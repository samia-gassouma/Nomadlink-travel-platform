import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Discount } from '../../models/discount';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private baseUrl = environment.apiBaseUrl;
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private _http: HttpClient) { }

  public save(discount:Discount){
    return this._http.post<Discount>(this.baseUrl+"/discount/add", discount);
  }

  public findAll(): Observable<Discount[]>{
    return this._http.get<Discount[]>(`${this.baseUrl}/discount/getAll`);
  }

  public delete(id: number): Observable<void>{
    return this._http.delete<void>(`${this.baseUrl}/discount/delete/${id}`)

  }

  public update(id:number,discount: Discount): Observable<Discount>{
    return this._http.put<Discount>(this.baseUrl + '/discount/update/'+id , discount, this.httpOptions);
  }

  public getById(id:number):Observable<Discount>{
    return this._http.get<Discount>(this.baseUrl+`/discount/get/${id}`)
  }

  public getMaxDate(): Observable<string>{
    return this._http.get<string>(this.baseUrl+"/discount/getMaxDate",{ responseType: 'text' as 'json' });
  }
}
