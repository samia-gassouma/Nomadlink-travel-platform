import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/front-office/services/event.service';
import { Event } from 'src/app/front-office/models/evenement.model'; // ✅ Import du vrai type utilisé dans le service
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminevents',
  templateUrl: './adminevents.component.html',
  styleUrls: ['./adminevents.component.scss']
})
export class AdmineventsComponent implements OnInit {
  events: Event[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private eventService: EventService,private router:Router) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération des événements';
        this.loading = false;
      }
    });
  }

  navigateToActivities(id_event: number): void {
    // Navigation to activities for the selected event
  }

  navigateToDetails(id_event: number): void {
    // Navigation to event details
  }

  navigateToEditEvent(id_event: number): void {
    this.router.navigate(['/admin/events/edit', id_event]);
  }
  

  deleteEvent(id_event: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEvent(id_event).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id_event !== id_event);
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la suppression de l’événement';
        }
      });
    }
  }
  

  navigateToAddEvent(): void {
    // Navigate to add event form
  }

  trackById(index: number, item: Event): number {
    return item.id_event;
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }
  formatImageUrl(imageUrl: string): string {
    if (imageUrl) {
      return `http://localhost:9000/picloud/api/activities/images/${imageUrl}`;
    }
    return imageUrl; // Si l'URL est déjà complète, la retourner telle quelle
  }
}
