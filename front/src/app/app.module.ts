import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutsModule } from "./back-office/layouts/layouts.module";
import { PagesModule } from "./back-office/pages/pages.module";

// Auth
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { initFirebaseBackend } from './back-office/authUtils';
import { FakeBackendInterceptor } from './back-office/core/helpers/fake-backend';
import { ErrorInterceptor } from './back-office/core/helpers/error.interceptor';
import { JwtInterceptor } from './back-office/core/helpers/jwt.interceptor';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// Store
import { rootReducer } from './back-office/store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { EcommerceEffects } from './back-office/store/Ecommerce/ecommerce_effect';
import { ProjectEffects } from './back-office/store/Project/project_effect';
import { TaskEffects } from './back-office/store/Task/task_effect';
import { CRMEffects } from './back-office/store/CRM/crm_effect';
import { CryptoEffects } from './back-office/store/Crypto/crypto_effect';
import { InvoiceEffects } from './back-office/store/Invoice/invoice_effect';
import { TicketEffects } from './back-office/store/Ticket/ticket_effect';
import { FileManagerEffects } from './back-office/store/File Manager/filemanager_effect';
import { TodoEffects } from './back-office/store/Todo/todo_effect';
import { ApplicationEffects } from './back-office/store/Jobs/jobs_effect';
import { ApikeyEffects } from './back-office/store/APIKey/apikey_effect';
import { AuthenticationEffects } from './back-office/store/Authentication/authentication.effects';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AuthInterceptorInterceptor} from "./services/gestionUser/interceptor/auth-interceptor.interceptor";
import {BlobToJsonInterceptor} from "./services/gestionUser/interceptor/blob-to-json.interceptor";
import {CodeInputModule} from "angular-code-input";
import {UserDetailsComponent} from "./pages/gestionuser/user-details/user-details.component";

import {UpdatePartnerComponent} from "./pages/gestionuser/update-partner/update-partner.component";
import {UpdateUserComponent} from "./pages/gestionuser/update-user/update-user.component";

import {HttpResponseInterceptor} from "./services/gestionUser/interceptor/http-response.interceptor";
import {HttpTokenInterceptor} from "./services/gestionUser/interceptor/http-token.interceptor";
import {LoginComponent} from "./pages/gestionuser/login/login.component";
import {RegisterComponent} from "./pages/gestionuser/register/register.component";
import {ActivateAccountComponent} from "./pages/gestionuser/activate-account/activate-account.component";
import {RegisterpartnerComponent} from "./pages/gestionuser/registerpartner/registerpartner.component";
import {SelectpreferencesComponent} from "./pages/gestionuser/selectpreferences/selectpreferences.component";

import {PartnerListComponent} from "./pages/gestionuser/partner-list/partner-list.component";
import {PartnerDetailsComponent} from "./pages/gestionuser/partner-details/partner-details.component";
import {UserListComponentComponent} from "./pages/gestionuser/user-list-component/user-list-component.component";
import {CreateUserComponent} from "./pages/gestionuser/create-user/create-user.component";
import {CreatePartnerComponent} from "./pages/gestionuser/create-partner/create-partner.component";
import {PreferencesListComponent} from "./pages/gestionuser/preferences-list/preferences-list.component";
import {UpdatePreferenceComponent} from "./pages/gestionuser/update-preference/update-preference.component";
import {ViewPreferenceComponent} from "./pages/gestionuser/view-preference/view-preference.component";
import {CreatePreferenceComponent} from "./pages/gestionuser/create-preference/create-preference.component";
import {NgbCarousel, NgbModule, NgbNav, NgbNavItem, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {MyprofileuserComponent} from "./pages/gestionuser/myprofileuser/myprofileuser.component";
import {FlatpickrModule} from "angularx-flatpickr";
import {EditmyprofileuserComponent} from "./pages/gestionuser/editmyprofileuser/editmyprofileuser.component";
import {MyprofilepartnerComponent} from "./pages/gestionuser/myprofilepartner/myprofilepartner.component";
import {EditmyprofilepartnerComponent} from "./pages/gestionuser/editmyprofilepartner/editmyprofilepartner.component";
import {SharedModule} from "./front-office/shared/shared.module";
import {CreateServiceComponent} from "./pages/gestionuser/create-service/create-service.component";
import {
  MycreatedservicespartnerComponent
} from "./pages/gestionuser/mycreatedservicespartner/mycreatedservicespartner.component";
import {
  UpdatemyservicespartnerComponent
} from "./pages/gestionuser/updatemyservicespartner/updatemyservicespartner.component";
import {ServiceDetailspComponent} from "./pages/gestionuser/service-detailsp/service-detailsp.component";
import {ActivePartnersComponent} from "./pages/gestionuser/active-partners/active-partners.component";
import {
  PartnerDetailsWithServicesfrontComponent
} from "./pages/gestionuser/partner-details-with-servicesfront/partner-details-with-servicesfront.component";
import {
  ActivePartnerServicesComponent
} from "./pages/gestionuser/active-partner-services/active-partner-services.component";
import {ServiceDetailsUComponent} from "./pages/gestionuser/service-details-u/service-details-u.component";
import {ServiceClientsComponent} from "./pages/gestionuser/service-clients/service-clients.component";
import {
  ClientServiceSelectedComponent
} from "./pages/gestionuser/client-service-selected/client-service-selected.component";
import {PartnerServicesbackComponent} from "./pages/gestionuser/partner-servicesback/partner-servicesback.component";
import {PartnerClientsbackComponent} from "./pages/gestionuser/partner-clientsback/partner-clientsback.component";
import {
  UserServicesSelectedComponent
} from "./pages/gestionuser/user-services-selected/user-services-selected.component";
import {ServicesListComponent} from "./pages/gestionuser/services-list/services-list.component";
import {ServiceDetailsAdminComponent} from "./pages/gestionuser/service-details-admin/service-details-admin.component";
import {NgChartsModule} from "ng2-charts";
import {UserPreferencesbackComponent} from "./pages/gestionuser/user-preferencesback/user-preferencesback.component";
import {MyprofileadminComponent} from "./pages/gestionuser/myprofileadmin/myprofileadmin.component";
import {ForgetPasswordComponent} from "./pages/gestionuser/forget-password/forget-password.component";


//Destination
import { FormModule } from './back-office/pages/form/form.module';
import { TopbarComponent } from './back-office/layouts/topbar/topbar.component';
import { EventService } from './front-office/services/event.service';
import { StatisticsComponent } from './back-office/pages/apps/jobs/statistics/statistics.component';
import { EventListComponent } from './front-office/components/event-list/event-list.component';
import { AdmineventsComponent } from './back-office/component/adminevents/adminevents.component';
import { AdminComponent } from "./back-office/admin/admin.component";
import { AdminLayoutComponent } from './back-office/layouts/admin-layout/admin-layout.component';
import { FrontOfficeComponent } from './front-office/front-office.component';
import { SafeUrlPipe } from './front-office/shared/pipes/safe-url.pipe';

import { TruncatePipe } from './front-office/shared/pipes/truncate.pipe';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EditEventComponent } from './back-office/component/edit-event/edit-event.component';
import { AddeventComponent } from './back-office/component/addevent/addevent.component';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { EventDetailsComponent } from './back-office/component/event-details/event-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';  // Nécessaire pour les champs de saisie
import { MatSelectModule } from '@angular/material/select';  // Nécessaire pour le mat-select
import { MatButtonModule } from '@angular/material/button';  // Pour les boutons
import { DestinationDetailsComponent } from './front-office/components/destination-details/destination-details.component';
import { DestinationListComponent } from './front-office/components/destination-list/destination-list.component';
import { AdmindestinationComponent } from './back-office/component/admindestination/admindestination.component';
import { DestinationFormComponent } from './back-office/component/destination-form/destination-form.component';
import { FilterPipe } from './front-office/shared/pipes/filter.pipe';
import { ActivitylistComponent } from './front-office/components/activitylist/activitylist.component';
import { ActivityFormComponent } from './back-office/component/activity-form/activity-form.component';
import { AdminactivityComponent } from './back-office/component/adminactivity/adminactivity.component';
import { EditActivityComponent } from './back-office/component/edit-activity/edit-activity.component';
import { EditdestinationComponent } from './back-office/component/editdestination/editdestination.component';
import { DestinationActivitiesComponent } from './back-office/component/destination-activities/destination-activities.component';
import { ActivitiesanddestinationsComponent } from './front-office/components/activitiesanddestinations/activitiesanddestinations.component';
import { DashboardComponent } from './back-office/pages/dashboards/dashboard/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import {CommonModule} from "@angular/common";
import {ProductModule} from "./front-office/pages/boutique/product.module";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/back-office/i18n/', '.json');
}

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  FakeBackendInterceptor;
}

@NgModule({
  declarations: [
    AppComponent,
      //Sahar
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ActivateAccountComponent,
    RegisterpartnerComponent,
      ForgetPasswordComponent,

    UserDetailsComponent,
    UpdateUserComponent,
    UserListComponentComponent,
    CreateUserComponent,

    PartnerListComponent,
    PartnerDetailsComponent,
    UpdatePartnerComponent,
    CreatePartnerComponent,

    PreferencesListComponent,
    UpdatePreferenceComponent,
    ViewPreferenceComponent,
    CreatePreferenceComponent,

    MyprofileuserComponent,
    EditmyprofileuserComponent,

    MyprofilepartnerComponent,
    EditmyprofilepartnerComponent,

    SelectpreferencesComponent,

    CreateServiceComponent,
    MycreatedservicespartnerComponent,
    UpdatemyservicespartnerComponent,
    ServiceDetailspComponent,
    ServiceClientsComponent,


    ActivePartnersComponent,
    PartnerDetailsWithServicesfrontComponent,
    ActivePartnerServicesComponent,
    ServiceDetailsUComponent,

      ClientServiceSelectedComponent,
      PartnerServicesbackComponent,
      PartnerClientsbackComponent,
      UserServicesSelectedComponent,
      ServicesListComponent,
      ServiceDetailsAdminComponent,

      UserPreferencesbackComponent,
      MyprofileadminComponent,




   // Ranim
    EventListComponent,
    AdmineventsComponent,
    SafeUrlPipe,
    AddeventComponent,
    EditEventComponent,
    EventDetailsComponent,
    DestinationDetailsComponent,
    DestinationListComponent,
    AdmindestinationComponent,
    DestinationFormComponent,
    FilterPipe,
    ActivitylistComponent,
    ActivityFormComponent,
    AdminactivityComponent,
    EditActivityComponent,
    EditEventComponent,
    EditdestinationComponent,
    DestinationActivitiesComponent,
    ActivitiesanddestinationsComponent,
    DestinationDetailsComponent





  ],
  imports: [

    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    PagesModule,
    ProductModule,

    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      AuthenticationEffects,
      EcommerceEffects,
      ProjectEffects,
      TaskEffects,
      CRMEffects,
      CryptoEffects,
      InvoiceEffects,
      TicketEffects,
      FileManagerEffects,
      TodoEffects,
      ApplicationEffects,
      ApikeyEffects]),


    //Sahar
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CodeInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbCarousel,
    FlatpickrModule,
    NgbNavOutlet,
    NgbNavItem,
    NgbNav,
    SharedModule,
    NgChartsModule,

      //ranim
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    CommonModule,
    FormModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    GoogleMapsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    GoogleMapsModule,
    GoogleMap,
    NgbModule,
    AdminComponent,



  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
      //Sahar

    HttpClient,
    { provide: HTTP_INTERCEPTORS, useClass: BlobToJsonInterceptor, multi: true } , // Ajoute l'intercepteur ici
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },


    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpResponseInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }