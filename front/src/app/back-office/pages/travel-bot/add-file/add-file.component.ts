import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileOperation } from 'src/app/front-office/models/travel-qa';
import { TravelQaService } from 'src/app/front-office/services/travel-bot/travel-qa.service';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrl: './add-file.component.scss'
})
export class AddFileComponent {
  fileForm: FormGroup;
  loading = false;
  success: string | null = null;
  error: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private qaService: TravelQaService
  ) {
    this.fileForm = this.fb.group({
      action: ['load', Validators.required],
      filepath: ['', Validators.required],
      file_format: ['json', Validators.required]
    });
  }
  
  onSubmit() {
    if (this.fileForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.success = null;
    this.error = null;
    
    const operation: FileOperation = this.fileForm.value;
    
    this.qaService.handleFile(operation).subscribe(
      (response) => {
        this.success = response.message;
        this.loading = false;
      },
      (error) => {
        this.error = `Failed to ${operation.action} file. Please check the file path and format.`;
        console.error('API Error:', error);
        this.loading = false;
      }
    );
  }
}
