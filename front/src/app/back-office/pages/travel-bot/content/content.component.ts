import { Component } from '@angular/core';
import { ContentItem } from 'src/app/front-office/models/travel-qa';
import { TravelQaService } from 'src/app/front-office/services/travel-bot/travel-qa.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent{
  ContentItems: ContentItem[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  constructor(private qaService: TravelQaService){}
  ngOnInit() {
    this.loadContentBase();
  }
  
  loadContentBase() {
    this.loading = true;
    this.qaService.getContentBase().subscribe(
      (items) => {
        this.ContentItems = items;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load Content base.';
        console.error('API Error:', error);
        this.loading = false;
      }
    );
  }
  
  get filteredItems(): ContentItem[] {
    if (!this.searchTerm) {
      return this.ContentItems;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.ContentItems.filter(item =>
      item.Question.toLowerCase().includes(term) ||
      item.Response.toLowerCase().includes(term)
    );
  }



}
