import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI = new GoogleGenerativeAI('AIzaSyASXSxAZN6s4OuXYAhTjfZqPN3DEoW2c1c');
  
  generateContent(prompt: string): Observable<string> {
    return from(this.generateContentAsync(prompt));
  }

  private async generateContentAsync(prompt: string): Promise<string> {
    try {
      // Utilisez le même modèle que dans Postman
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const result = await model.generateContent({
        contents: [{
          role: 'user',  // Add this
          parts: [{ text: prompt }]
        }]
      });
      
      
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Erreur Gemini API:', error);
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: any): Error {
    if (error.message.includes('quota')) {
      return new Error('Quota dépassé - Activez la facturation dans Google Cloud');
    }
    if (error.message.includes('API key')) {
      return new Error('Clé API invalide ou restrictions non configurées');
    }
    return error;
  }
}