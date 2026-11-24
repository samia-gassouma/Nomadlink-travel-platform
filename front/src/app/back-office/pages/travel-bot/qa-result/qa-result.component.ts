import { Component, Input } from '@angular/core';
import { QuestionResponse } from 'src/app/front-office/models/travel-qa';

@Component({
  selector: 'app-qa-result',
  templateUrl: './qa-result.component.html',
  styleUrl: './qa-result.component.scss'
})
export class QaResultComponent {
  @Input() result!: QuestionResponse;
  
  // Helper method to format confidence as percentage
  getConfidencePercent(): string {
    return (this.result.confidence * 100).toFixed(1) + '%';
  }
}
