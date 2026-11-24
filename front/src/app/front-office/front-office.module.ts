import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReservationEventComponent  } from './pages/reservation-event/reservation-event.component'; // ✅ Vérifie que ce chemin est correct
import { ReactiveFormsModule } from '@angular/forms'; // Add this import
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreadcrumbModule } from 'angular-crumbs';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPayPalModule } from 'ngx-paypal';
import { ReservationComponent  } from './pages/reservation/reservation.component'; // ✅ Vérifie que ce chemin est correct
import { ConfirmationComponent  } from './pages/confirmation/confirmation.component'; // ✅ Vérifie que ce chemin est correct
import { ConfirmationeventComponent  } from './pages/confirmationevent/confirmationevent.component'; // ✅ Vérifie que ce chemin est correct
import { HeaderComponent } from './shared/header/header.component';
import { SharedModule } from './shared/shared.module';
import { GeminiTestComponent } from './pages/gemini-test/gemini-test.component';


@NgModule({
  declarations: [
    ReservationEventComponent,
    ReservationComponent,
    FrontOfficeComponent,
    ConfirmationComponent,
    ConfirmationeventComponent,
    GeminiTestComponent,
    
  ],
  imports: [
    CommonModule, // ✅ `CommonModule` pour les directives Angular (NgIf, NgFor)
    FrontOfficeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    HttpClientModule,
    NgxSliderModule,
    NgxPaginationModule,
    NgxPayPalModule,
    SharedModule
  ],
 // exports: [
  //  HeaderComponent // ✅ Ajouté ici pour pouvoir l'utiliser ailleurs
  //]


})
export class FrontOfficeModule { }
