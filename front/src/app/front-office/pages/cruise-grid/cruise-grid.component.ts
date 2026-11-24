import { Component, OnInit } from '@angular/core';
// import { EventService  } from 'src/app/front-office/services/event/event.service';
// import { Event  } from 'src/app/front-office/models/event.model';


@Component({
  selector: 'app-cruise-grid',
  templateUrl: './cruise-grid.component.html',
  styleUrls: ['./cruise-grid.component.css']
})
export class CruiseGridComponent {

    // implements OnInit {
  // events: Event[] = [];
  // page: number = 1;
  //
  // constructor(private eventService: EventService) {}
  //
  // ngOnInit(): void {
  //   this.fetchEvents();
  // }
  //
  // fetchEvents(): void {
  //   this.eventService.getAllEvents().subscribe(
  //     (data) => {
  //       this.events = data;
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des événements', error);
  //     }
  //   );
  // }
}