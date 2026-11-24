import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import {MyprofileuserComponent} from "../pages/gestionuser/myprofileuser/myprofileuser.component";
import {SelectpreferencesComponent} from "../pages/gestionuser/selectpreferences/selectpreferences.component";
import {EditmyprofileuserComponent} from "../pages/gestionuser/editmyprofileuser/editmyprofileuser.component";
import {MyprofilepartnerComponent} from "../pages/gestionuser/myprofilepartner/myprofilepartner.component";
import {EditmyprofilepartnerComponent} from "../pages/gestionuser/editmyprofilepartner/editmyprofilepartner.component";
import {CreateServiceComponent} from "../pages/gestionuser/create-service/create-service.component";
import {
  MycreatedservicespartnerComponent
} from "../pages/gestionuser/mycreatedservicespartner/mycreatedservicespartner.component";
import {
  UpdatemyservicespartnerComponent
} from "../pages/gestionuser/updatemyservicespartner/updatemyservicespartner.component";
import {ServiceDetailspComponent} from "../pages/gestionuser/service-detailsp/service-detailsp.component";
import {ActivePartnersComponent} from "../pages/gestionuser/active-partners/active-partners.component";

import {
  PartnerDetailsWithServicesfrontComponent
} from "../pages/gestionuser/partner-details-with-servicesfront/partner-details-with-servicesfront.component";
import {
  ActivePartnerServicesComponent
} from "../pages/gestionuser/active-partner-services/active-partner-services.component";
import {ServiceDetailsUComponent} from "../pages/gestionuser/service-details-u/service-details-u.component";
import {ServiceClientsComponent} from "../pages/gestionuser/service-clients/service-clients.component";
import {
  ClientServiceSelectedComponent
} from "../pages/gestionuser/client-service-selected/client-service-selected.component";

import { ReservationEventComponent  } from './pages/reservation-event/reservation-event.component'; // ✅ Vérifie que ce chemin est correct
import { ReservationComponent  } from './pages/reservation/reservation.component'; // ✅ Vérifie que ce chemin est correct
import { ContentComponent } from './pages/flights-grid-left/content/content.component';  // Vérifie ce chemin
import { ConfirmationComponent  } from './pages/confirmation/confirmation.component'; // ✅ Vérifie que ce chemin est correct
import { ConfirmationeventComponent  } from './pages/confirmationevent/confirmationevent.component'; // ✅ Vérifie que ce chemin est correct
import { GeminiTestComponent } from './pages/gemini-test/gemini-test.component';
import {DestinationListComponent} from "./components/destination-list/destination-list.component";
import {DashboardComponent} from "../back-office/pages/dashboards/dashboard/dashboard.component";
import {
  ActivitiesanddestinationsComponent
} from "./components/activitiesanddestinations/activitiesanddestinations.component";
import {DestinationDetailsComponent} from "./components/destination-details/destination-details.component";
import {
  DestinationActivitiesComponent
} from "../back-office/component/destination-activities/destination-activities.component";
import {EventListComponent} from "./components/event-list/event-list.component";
import {ActivitylistComponent} from "./components/activitylist/activitylist.component";
import {ListproductComponent} from "./pages/boutique/listproduct/listproduct.component";
import {DetailproductComponent} from "./pages/boutique/detailproduct/detailproduct.component";
import {PaiementproductComponent} from "./pages/boutique/paiementproduct/paiementproduct.component";
import {CartproductComponent} from "./pages/boutique/cartproduct/cartproduct.component";
import {CommandeComponent} from "./pages/boutique/commande/commande.component";
import { AuthGuardS } from '../services/gestionUser/guards/AuthguardS';


const routes: Routes = [
  { path: '', component: FrontOfficeComponent },

  //Sahar-front
  //Sahar-User-front
  { path: 'myprofileuser', component: MyprofileuserComponent },// profile
  {path: 'editprofileuser',component: EditmyprofileuserComponent}, //Edit profile
  //Sahar-partner-front
  { path: 'myprofilepartner', component: MyprofilepartnerComponent },//profile
  {path: 'editprofilepartner',component: EditmyprofilepartnerComponent},//edit profile
  //sahar-preferences-front
  { path: 'selectpreferences', component: SelectpreferencesComponent},//selectpreference
    //Sahar-services-front-partner
  { path: 'createservicepartner', component: CreateServiceComponent},//createservice
  { path: 'mycreatedservicespartner', component: MycreatedservicespartnerComponent},//createservice
  { path: 'updatemyservicepartner/:id', component: UpdatemyservicespartnerComponent},//updateservice
  { path: 'service-detailspartner/:id', component: ServiceDetailspComponent},//updateservice
  { path: 'activepartners', component: ActivePartnersComponent},//listeactive
  { path: 'partnerdetail/:id', component: PartnerDetailsWithServicesfrontComponent },//detailf
  { path: 'serviceactivepartner', component: ActivePartnerServicesComponent },//detailf
  { path: 'service-details/:id', component: ServiceDetailsUComponent },//detailf
  { path: 'service-clients', component: ServiceClientsComponent },//detailf
  { path: 'client-service-selected/:clientId', component: ClientServiceSelectedComponent },//detailf


  { path: '', component: FrontOfficeComponent },
  // Homepage
  { path: 'home-v1', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), data: { breadcrumb: "Homepage" } },
  { path: 'home-v2', loadChildren: () => import('./pages/home-two/home-two.module').then(m => m.HomeTwoModule), data: { breadcrumb: "Homepage" } },
  // About
  { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule), data: { breadcrumb: "About Us" } },
  // Destination
  
  // Activity
  
  // Flights
  { path: 'flight-grid-left', loadChildren: () => import('./pages/flights-grid-left/flights-grid-left.module').then(m => m.FlightsGridLeftModule), data: { breadcrumb: "Flights Grid" } },
  {path: 'booking/:volId', component: ReservationComponent  // ✅ Vérifie que cette ligne existe !

  },  { path: 'reservation/event/:eventId', component: ReservationEventComponent },

    { path: 'flight', component: ContentComponent },
  { path: 'reservation/flight/:volId', component: ReservationComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'confirmationevent', component: ConfirmationeventComponent },
  { path: 'gemini', component: GeminiTestComponent },

  

  // Cruise
  // { path: 'Event-grid', loadChildren: () => import('./pages/cruise-grid/cruise-grid.module').then(m => m.CruiseGridModule), data: { breadcrumb: "Cruise Grid" } },
  

  // Pack
  { path: 'pack', loadChildren: () => import('./pages/pack/pack.module').then(m => m.PackModule)},
  // Reward Points
  { path: 'reward-points', loadChildren: () => import('./pages/reward-points/reward-points.module').then(m => m.RewardPointsModule)},
  // Payment
  { path: 'paiement', loadChildren: () => import('./pages/paiement/paiement.module').then(m => m.PaiementModule)},


 //boutique


 //claim



 //community

    //Ranim

  { path: 'destinations', component: DestinationListComponent },

  { path: 'dashboard', component: DashboardComponent },

  { path: 'destinations/:destinationId/activities', component: ActivitiesanddestinationsComponent },

  {
    path: 'destinations/:id',
    component: DestinationDetailsComponent
  }
  ,
  { path: 'act', component: DestinationActivitiesComponent },  // Add the route for EventListComponent

  { path: 'events', component: EventListComponent },  // Add the route for EventListComponent

  { path: 'activities', component: ActivitylistComponent },

  //boutique
  { path: 'shop', component: ListproductComponent },
  { path: 'product-details/:id', component: DetailproductComponent },
  { path: 'paiement/:id', component: PaiementproductComponent, canActivate: [AuthGuardS] },
  { path: 'panier', component: CartproductComponent, canActivate: [AuthGuardS] },
  { path: 'mes-commandes', component: CommandeComponent , canActivate: [AuthGuardS]},




  // Contact
  { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule), data: { breadcrumb: "Contact Us" } },
  // Faqs
  { path: 'faqs', loadChildren: () => import('./pages/faqs/faqs.module').then(m => m.FaqsModule), data: { breadcrumb: "FAQ's" } },
  
  // Gallery
  { path: 'gallery', loadChildren: () => import('./pages/gallery/gallery.module').then(m => m.GalleryModule), data: { breadcrumb: "Gallery" } },
  // Additional
  { path: 'error-page', loadChildren: () => import('./pages/error-page/error-page.module').then(m => m.ErrorPageModule), data: { breadcrumb: "Error 404" } },
  { path: '**', loadChildren: () => import('./pages/error-page/error-page.module').then(m => m.ErrorPageModule), data: { breadcrumb: "Error 404" } },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
