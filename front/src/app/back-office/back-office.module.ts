import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PreferencesListComponent} from "../pages/gestionuser/preferences-list/preferences-list.component";
import {UpdatePreferenceComponent} from "../pages/gestionuser/update-preference/update-preference.component";
import {ViewPreferenceComponent} from "../pages/gestionuser/view-preference/view-preference.component";
import {CreatePreferenceComponent} from "../pages/gestionuser/create-preference/create-preference.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {CodeInputModule} from "angular-code-input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbCarousel, NgbNav, NgbNavItem, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {FlatpickrModule} from "angularx-flatpickr";
import {SharedModule} from "./shared/shared.module";
import { WebsocketService } from 'src/app/front-office/services/websocket/websocket.service';  // Assure-toi du bon chemin


@NgModule({
  declarations: [
     
  ],
  imports: [
    CommonModule,
    BackOfficeRoutingModule, 
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

  ],  providers: [WebsocketService], // Fournir le service ici

})
export class BackOfficeModule { }
