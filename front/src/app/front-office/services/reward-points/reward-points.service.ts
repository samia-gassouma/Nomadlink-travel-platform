import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RewardPoints } from '../../models/RewardPoints';

@Injectable({
  providedIn: 'root'
})
export class RewardPointsService {
  baseUrl = environment.apiBaseUrl;
  constructor(private _http: HttpClient) { }
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  public getByUser(id: number) : Observable<RewardPoints>{
    return this._http.get<RewardPoints>(this.baseUrl + `/reward-points/get/${id}`)
  }

  public getById(id:number): Observable<RewardPoints>{
    return this._http.get<RewardPoints>(this.baseUrl + `/reward-points/getById/${id}`)
  }

  public getPromoCode(id: number): Observable<{token: string, points: any}> {
    return this._http.get<{token: string, points: any}>(this.baseUrl + `/getPromo/${id}`);
  }

  public findAll() : Observable<RewardPoints[]>{
    return this._http.get<RewardPoints[]>(this.baseUrl+"/reward-points/getAll")
  }

  public add(id:number): Observable<void>{
    return this._http.post<void>(this.baseUrl+`/reward-points/add/${id}`,{});
 }
 
   public update(id:number,points: RewardPoints): Observable<RewardPoints>{
     return this._http.put<RewardPoints>(this.baseUrl + '/reward-points/update/'+id , points, this.httpOptions);
   }
  
}
