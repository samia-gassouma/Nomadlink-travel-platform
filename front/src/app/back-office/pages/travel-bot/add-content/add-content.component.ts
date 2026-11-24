import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TravelQaService } from 'src/app/front-office/services/travel-bot/travel-qa.service';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrl: './add-content.component.scss'
})
export class AddContentComponent {
  addForm: FormGroup;
  loading = false;
  success: string | null = null;
  error: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private qaService: TravelQaService
  ) {
    this.addForm = this.fb.group({
      Question: ['', [Validators.required, Validators.minLength(5)]],
      Response: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  onSubmit() {
    if (this.addForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.success = null;
    this.error = null;
    
    this.qaService.addContentItem(this.addForm.value).subscribe(
      (response) => {
        this.success = response.message;
        this.loading = false;
        this.addForm.reset();
      },
      (error) => {
        this.error = 'Failed to add knowledge. Please try again.';
        console.error('API Error:', error);
        this.loading = false;
      }
    );
  }
}
