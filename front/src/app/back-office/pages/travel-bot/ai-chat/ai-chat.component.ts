import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TravelQaService } from 'src/app/front-office/services/travel-bot/travel-qa.service';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent implements OnInit{
  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private modelService: TravelQaService
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialize with a welcome message
    this.messages.push({
      content: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (this.chatForm.invalid || this.isLoading) {
      return;
    }

    const userMessage = this.chatForm.get('message')?.value.trim();
    
    // Add user message to chat
    this.messages.push({
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    // Clear input field
    this.chatForm.get('message')?.setValue('');
    
    // Set loading state
    this.isLoading = true;

    // Call the service
    this.modelService.askModel(userMessage).subscribe({
      next: (response) => {
        // Add model response to chat
        this.messages.push({
          content: response.generated_text,
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error getting response from model:', error);
        this.messages.push({
          content: 'Sorry, there was an error processing your request.',
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

}
