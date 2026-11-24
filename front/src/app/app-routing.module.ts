import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './back-office/layouts/layout.component';



import {LoginComponent} from "./pages/gestionuser/login/login.component";
import {RegisterComponent} from "./pages/gestionuser/register/register.component";
import {ActivateAccountComponent} from "./pages/gestionuser/activate-account/activate-account.component";
import {RegisterpartnerComponent} from "./pages/gestionuser/registerpartner/registerpartner.component";
import {AuthGuardS} from "./services/gestionUser/guards/AuthguardS";
import {LoginGuard} from "./services/gestionUser/guards/LoginGuard ";
import {ForgetPasswordComponent} from "./pages/gestionuser/forget-password/forget-password.component";

import { DestinationListComponent } from './front-office/components/destination-list/destination-list.component';
import { AdminComponent } from './back-office/admin/admin.component';
import { EventListComponent } from './front-office/components/event-list/event-list.component';
import { AdmineventsComponent } from './back-office/component/adminevents/adminevents.component';
import { AddeventComponent } from './back-office/component/addevent/addevent.component';
import { EditEventComponent } from './back-office/component/edit-event/edit-event.component';
import { EventDetailsComponent } from './back-office/component/event-details/event-details.component';
import { DestinationDetailsComponent } from './front-office/components/destination-details/destination-details.component';
import { AdmindestinationComponent } from './back-office/component/admindestination/admindestination.component';
import { DestinationFormComponent } from './back-office/component/destination-form/destination-form.component';
import { ActivitylistComponent } from './front-office/components/activitylist/activitylist.component';
import { ActivityFormComponent } from './back-office/component/activity-form/activity-form.component';
import { AdminactivityComponent } from './back-office/component/adminactivity/adminactivity.component';
import { EditActivityComponent } from './back-office/component/edit-activity/edit-activity.component';
import { EditdestinationComponent } from './back-office/component/editdestination/editdestination.component';
import { DestinationActivitiesComponent } from './back-office/component/destination-activities/destination-activities.component';
import { ActivitiesanddestinationsComponent } from './front-office/components/activitiesanddestinations/activitiesanddestinations.component';
import {DashboardComponent} from "./back-office/pages/dashboards/dashboard/dashboard.component";
import {AdminLayoutComponent} from "./back-office/layouts/admin-layout/admin-layout.component";
import {ListproductComponent} from "./front-office/pages/boutique/listproduct/listproduct.component";
import {AddproduitComponent} from "./back-office/pages/boutique/produit/addproduit/addproduit.component";
import {ListproduitComponent} from "./back-office/pages/boutique/produit/listproduit/listproduit.component";
import {UpdateproduitComponent} from "./back-office/pages/boutique/produit/updateproduit/updateproduit.component";
import {ListorderComponent} from "./back-office/pages/boutique/commande/listorder/listorder.component";
import {UpdateorderComponent} from "./back-office/pages/boutique/commande/updateorder/updateorder.component";
import {AddDeliveryComponent} from "./back-office/pages/boutique/livraison/adddelivery/adddelivery.component";
import {ListdeliveryComponent} from "./back-office/pages/boutique/livraison/listdelivery/listdelivery.component";
import {UpdatedeliveryComponent} from "./back-office/pages/boutique/livraison/updatedelivery/updatedelivery.component";
import {StatistiquesComponent} from "./back-office/pages/boutique/statistiques/statistiques.component";
import {DetailproductComponent} from "./front-office/pages/boutique/detailproduct/detailproduct.component";
import {PaiementproductComponent} from "./front-office/pages/boutique/paiementproduct/paiementproduct.component";
import {CartproductComponent} from "./front-office/pages/boutique/cartproduct/cartproduct.component";
import {CommandeComponent} from "./front-office/pages/boutique/commande/commande.component";




const routes: Routes = [
  // { path: '', component: LayoutComponent, loadChildren: () => import('./back-office/pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  // { path: 'back-office', loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule) },
  // { path: 'front-office', loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule) },
  //Sahar -sec - homewelcome
  {path: 'back-office', loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule), canActivate: [AuthGuardS], data: { roles: ['ADMIN'] }},
  {path: 'front-office', loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule), canActivate: [AuthGuardS], data: { roles: ['USER', 'PARTNER', 'ADMIN'] }},
  { path: 'home-v1', loadChildren: () => import('./front-office//pages/home/home.module').then(m => m.HomeModule), data: { breadcrumb: "Homepage" } },
  { path: 'home-v2', loadChildren: () => import('./front-office/pages/home-two/home-two.module').then(m => m.HomeTwoModule), data: { breadcrumb: "Homepage" } },
  //Sahar - out
  {path: 'login', component: LoginComponent,  canActivate: [LoginGuard]},
  {path: 'register', component: RegisterComponent,  canActivate: [LoginGuard]},
  {path: 'activate-account', component: ActivateAccountComponent, canActivate: [LoginGuard]},
  {path:'register-partner', component:RegisterpartnerComponent,  canActivate: [LoginGuard]},
  {path:'forget-password', component:ForgetPasswordComponent,  canActivate: [LoginGuard]},


    //Ranim
    {
      path: 'back-office/destinations/edit/:id',
      component: EditdestinationComponent,  // Main admin content
    },


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

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminComponent,  // Main admin content
      },

      {
        path: 'edit-activity/:id',
        component: EditActivityComponent,  // Main admin content
      },

      {
        path: 'activities',
        component: AdminactivityComponent,  // Main admin content
      },
      {
        path: 'activities/add',
        component: ActivityFormComponent,  // Main admin content
      },
      {
        path: 'destinations',
        component: AdmindestinationComponent,  // Main admin content
      },
      {
        path: 'destinations/add',
        component: DestinationFormComponent,  // Main admin content
      },
 

      {
        path: 'events',
        component: AdmineventsComponent,  // Main admin content
      },

      {
        path: 'events/add',
        component: AddeventComponent,  // Main admin content
      },
      {
        path: 'events/eventdetails',
        component: EventDetailsComponent,  // Main admin content
      },
      {
        path: 'events/edit/:id_event',
        component: EditEventComponent,  // Main admin content
      },


      // Add more child routes if needed





    ]
  },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
