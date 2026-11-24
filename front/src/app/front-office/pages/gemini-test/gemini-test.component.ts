import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeminiService } from 'src/app/front-office/services/ia/flight-price.service';

@Component({
  selector: 'app-gemini-test',
  templateUrl: './gemini-test.component.html',
  styleUrls: ['./gemini-test.component.scss']
})
export class GeminiTestComponent implements OnInit {
  @ViewChild('chatArea') chatArea!: ElementRef; // Ajout du ! pour indiquer une initialisation différée

  today: Date = new Date();
  userPrompt: string = '';
  formattedResponse: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isListening: boolean = false;

  // Pour la reconnaissance vocale
  speechRecognition: any;

  constructor(private geminiService: GeminiService) {}

  ngOnInit(): void {
    // Initialiser la reconnaissance vocale si disponible dans le navigateur
    this.initSpeechRecognition();
  }

  /**
   * Méthode existante - conservée pour compatibilité
   */
  generate() {
    this.sendRequest();
  }

  /**
   * Envoie la requête à l'API Gemini
   */
  sendRequest() {
    if (!this.userPrompt.trim()) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.formattedResponse = null;

    this.geminiService.generateContent(this.userPrompt).subscribe(
        res => {
          this.formattedResponse = res;
          this.isLoading = false;
          setTimeout(() => this.scrollToBottom(), 100);
        },
        err => {
          this.errorMessage = 'Une erreur s\'est produite lors de la génération.';
          console.error('Erreur:', err);
          this.isLoading = false;
        }
    );
  }

  /**
   * Gère la sélection d'une suggestion
   * @param suggestion Le texte de la suggestion
   */
  selectSuggestion(suggestion: string): void {
    this.userPrompt = suggestion;
    this.sendRequest();
  }

  /**
   * Réessaye la dernière requête en cas d'erreur
   */
  retryRequest(): void {
    if (this.userPrompt) {
      this.sendRequest();
    }
  }

  /**
   * Démarre l'enregistrement vocal
   */
  startVoiceInput(): void {
    if (this.speechRecognition) {
      this.isListening = true;
      this.speechRecognition.start();
    } else {
      this.errorMessage = 'La reconnaissance vocale n\'est pas disponible sur votre navigateur.';
    }
  }

  /**
   * Arrête l'enregistrement vocal
   */
  stopVoiceInput(): void {
    if (this.speechRecognition) {
      this.isListening = false;
      this.speechRecognition.stop();
    }
  }

  /**
   * Initialise la reconnaissance vocale si disponible
   */
  private initSpeechRecognition(): void {
    // Vérifier si la reconnaissance vocale est disponible dans le navigateur
    const SpeechRecognition = (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.lang = 'fr-FR';
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;

      this.speechRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.userPrompt = transcript;
        this.isListening = false;
      };

      this.speechRecognition.onerror = (event: any) => {
        this.isListening = false;
        console.error('Erreur de reconnaissance vocale:', event.error);
      };

      this.speechRecognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  /**
   * Défile vers le bas de la zone de chat
   */
  private scrollToBottom(): void {
    if (this.chatArea && this.chatArea.nativeElement) {
      this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
    }
  }
}


