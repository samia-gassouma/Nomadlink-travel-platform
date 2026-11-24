import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PricePlan } from '../../models/PricePlan';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricePlanService {
  baseUrl = environment.apiBaseUrl;
  constructor(private _http: HttpClient) { }

  public save(pricePlan: PricePlan, idPack:number): Observable<PricePlan>{
    return this._http.post<PricePlan>(this.baseUrl + `/price-plan/add/${idPack}`, pricePlan);
  }

  public update(pricePlan:PricePlan,id:number): Observable<PricePlan>{
    return this._http.put<PricePlan>(this.baseUrl+ `/price-plan/update/${id}`,pricePlan);
  }

  public getById(id:number): Observable<PricePlan>{
    return this._http.get<PricePlan>(this.baseUrl+`/price-plan/get/${id}`);
  }

  public findAll(): Observable<PricePlan[]>{
    return this._http.get<PricePlan[]>(this.baseUrl+"/price-plan/getAll");
  }

  public delete(id: number): Observable<void>{
    return this._http.delete<void>(this.baseUrl+`/price-plan/delete/${id}`)
  }

}
