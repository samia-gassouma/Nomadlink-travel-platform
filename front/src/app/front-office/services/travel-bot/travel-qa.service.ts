import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, FileOperation, ContentItem, QuestionRequest, QuestionResponse } from '../../models/travel-qa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TravelQaService {

  private apiUrl = 'http://localhost:5000/api';
  
  constructor(private http: HttpClient) { }

  askQuestion(request: QuestionRequest): Observable<QuestionResponse> {
    return this.http.post<QuestionResponse>(`${this.apiUrl}/ask`, request);
  }

  getContentBase(): Observable<ContentItem[]> {
    return this.http.get<ContentItem[]>(`${this.apiUrl}/content`);
  }

  addContentItem(item: ContentItem): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/content`, item);
  }

  addMultipleContentItems(items: ContentItem[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/content`, items);
  }

  handleFile(operation: FileOperation): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/content/file`, operation);
  }

  askModel(prompt: string): Observable<any>{
    console.log("message from service", prompt);
    return this.http.post<string>(`${this.apiUrl}/generate`, {"prompt": prompt});
  }

}
