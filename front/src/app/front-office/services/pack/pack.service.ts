import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pack } from '../../models/pack';
import { PackAssociationRequest } from '../../models/PackAssociationRequest';
import { PackAssociation } from '../../models/PackAssociation';

@Injectable({
  providedIn: 'root'
})
export class PackService {
  private baseUrl = environment.apiBaseUrl;
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private _http: HttpClient) { }

  public findAll(): Observable<Pack[]> {
    return this._http.get<Pack[]>(`${this.baseUrl}/pack/getAll`,this.httpOptions);
  }

  public save(packAssociation: PackAssociationRequest) {
    return this._http.post<PackAssociationRequest>(this.baseUrl + "/packAssociations/add", packAssociation, { responseType: 'text' as 'json' });
  }

  public getById(id: number): Observable<PackAssociation[]> {
    return this._http.get<PackAssociation[]>(this.baseUrl + `/packAssociations/getByPack/${id}`);
  }

  public update(id: number, packAssociations:PackAssociation[]): Observable<PackAssociation[]>{
    return this._http.put<PackAssociation[]>(this.baseUrl + `/packAssociations/update/${id}`,packAssociations);
  }

  public delete(id:number): Observable<void>{
    return this._http.delete<void>(this.baseUrl + `/packAssociations/delete/${id}`, { responseType: 'text' as 'json' });
  }
}
