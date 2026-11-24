import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import {Product} from "../../../models/boutique/product.model";



@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:9000/picloud/api/produits';

  constructor(private http: HttpClient) {}

  // Ajout d'un produit avec des données FormData
  addProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/create`, productData);
  }

  // Récupérer la liste de tous les produits
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }

  // Récupérer un produit spécifique par ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get/${id}`);
  }

  updateProduct(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, { observe: 'response' }).pipe(
      catchError((error) => {
        console.error('Erreur réelle de mise à jour:', error);
        return throwError(error);  // Réexporte l'erreur pour qu'elle puisse être gérée dans le composant
      })
    );
  }
  
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }
  
  
  

  // Suppression d'un produit par ID
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Upload d'une nouvelle image
  uploadImage(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/upload`, formData);
  }

  // Supprimer l'image d'un produit
  deleteProductImage(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-image/${productId}`);
  }
}
