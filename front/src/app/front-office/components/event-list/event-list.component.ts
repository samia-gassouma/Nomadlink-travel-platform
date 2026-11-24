import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/front-office/services/event.service';
import { Event } from 'src/app/front-office/models/evenement.model';  // Import Event from the model file
import { HttpErrorResponse } from '@angular/common/http';  // Import HttpErrorResponse
import { DomSanitizer } from '@angular/platform-browser';  // Import DomSanitizer
import { Router } from '@angular/router';  // Import Router for navigation
import { environment } from 'src/environments/environment';
import { WeatherService } from '../../services/weather.service';
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events: Event[] = [];  // Using the imported Event model
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  weatherData: any;
  weatherLoading: boolean = false;
  weatherTried: boolean = false;
  currentEventLocation = '';
  safeMapUrl: any;
  weatherEventId: number | null = null;

  errorMessage: string = '';
  isModalVisible: boolean = false;  // Define the modal visibility flag
  selectedEvent?: Event;

  constructor(private eventService: EventService, 
              private sanitizer: DomSanitizer,
              private router: Router,
              private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadEvents();
    console.log(this.events);  // Vérifiez si les événements sont chargés
    this.filterEvents();
  }

  filterEvents(): void {
    const term = this.searchTerm.toLowerCase();
    const type = this.selectedType;
  
    this.filteredEvents = this.events
      .filter(event =>
        (!term || event.title.toLowerCase().includes(term) || event.location.toLowerCase().includes(term)) &&
        (!type || event.type === type)
      )
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());  // Date la plus proche d'abord
  }

  selectEvent(event: Event): void {
    this.selectedEvent = event;
    this.isModalVisible = true;
    this.loadMapWithLocation(event.location);
  }

  getWeatherForEvent(location: string): void {
    this.weatherLoading = true;
    this.weatherTried = false;
    this.weatherService.getWeather(location).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.weatherLoading = false;
        this.weatherTried = true;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la météo:', error);
        this.weatherLoading = false;
        this.weatherTried = true;
      }
    });
  }
  
  loadEvents(): void {
    this.eventService.getAllEvents().subscribe(
      (data: Event[]) => {
        this.events = data.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
        this.filterEvents();  // ✅ filtrage directement ici
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Erreur lors du chargement des événements';
        console.error('Erreur :', error);
      }
    );
  }

  formatImageUrl(imageUrl: string): string {
    if (imageUrl) {
      return `http://localhost:9000/picloud/api/activities/images/${imageUrl}`;
    }
    return imageUrl; // Si l'URL est déjà complète, la retourner telle quelle
  }

  viewLocationInMap(location: string): void {
    const query = encodeURIComponent(location);  // URL-encode the location string
    const mapUrl = `https://www.google.com/maps?q=${query}`;  // Construct Google Maps URL
    window.open(mapUrl, '_blank');
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  loadMapWithLocation(location: string): void {
    if (location) {
      const query = encodeURIComponent(location);
      const url = `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=${query}`;
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}