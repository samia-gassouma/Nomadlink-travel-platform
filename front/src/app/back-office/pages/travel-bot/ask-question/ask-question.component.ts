import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionResponse } from 'src/app/front-office/models/travel-qa';
import { TravelQaService } from 'src/app/front-office/services/travel-bot/travel-qa.service';


@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrl: './ask-question.component.scss'
})
export class AskQuestionComponent {
questionForm: FormGroup;
  loading = false;
  result: QuestionResponse | null = null;
  error: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private qaService:  TravelQaService
  ) {
    this.questionForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(5)]],
      top_n: [3, [Validators.min(1), Validators.max(10)]],
      similarity_threshold: [0.3, [Validators.min(0), Validators.max(1)]]
    });
  }
  
  onSubmit() {
    if (this.questionForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    this.result = null;
    
    this.qaService.askQuestion(this.questionForm.value).subscribe(
      (response: QuestionResponse | null) => {
        this.result = response;
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Error connecting to the server. Please try again.';
        console.error('API Error:', error);
        this.loading = false;
      }
    );
  }
}



