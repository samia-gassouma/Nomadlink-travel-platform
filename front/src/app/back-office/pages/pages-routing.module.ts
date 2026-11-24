import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";
import {UserListComponentComponent} from "../../pages/gestionuser/user-list-component/user-list-component.component";
import {CreateUserComponent} from "../../pages/gestionuser/create-user/create-user.component";
import {UpdateUserComponent} from "../../pages/gestionuser/update-user/update-user.component";
import {UserDetailsComponent} from "../../pages/gestionuser/user-details/user-details.component";
import {PartnerListComponent} from "../../pages/gestionuser/partner-list/partner-list.component";
import {CreatePartnerComponent} from "../../pages/gestionuser/create-partner/create-partner.component";
import {UpdatePartnerComponent} from "../../pages/gestionuser/update-partner/update-partner.component";
import {PartnerDetailsComponent} from "../../pages/gestionuser/partner-details/partner-details.component";
import {PreferencesListComponent} from "../../pages/gestionuser/preferences-list/preferences-list.component";
import {CreatePreferenceComponent} from "../../pages/gestionuser/create-preference/create-preference.component";
import {ViewPreferenceComponent} from "../../pages/gestionuser/view-preference/view-preference.component";
import {UpdatePreferenceComponent} from "../../pages/gestionuser/update-preference/update-preference.component";
import {
    PartnerServicesbackComponent
} from "../../pages/gestionuser/partner-servicesback/partner-servicesback.component";
import {PartnerClientsbackComponent} from "../../pages/gestionuser/partner-clientsback/partner-clientsback.component";
import {
    UserServicesSelectedComponent
} from "../../pages/gestionuser/user-services-selected/user-services-selected.component";
import {ServicesListComponent} from "../../pages/gestionuser/services-list/services-list.component";
import {
    ServiceDetailsAdminComponent
} from "../../pages/gestionuser/service-details-admin/service-details-admin.component";
import {
    UserPreferencesbackComponent
} from "../../pages/gestionuser/user-preferencesback/user-preferencesback.component";
import {MyprofileadminComponent} from "../../pages/gestionuser/myprofileadmin/myprofileadmin.component";
import {ListflightComponent} from './listflight/listflight.component';
import { EditFlightComponent } from './editflight/editflight.component'; // adjust path if needed
import { ReserveflightComponent } from './reserveflight/reserveflight.component';
import { CreateflightComponent } from './createflight/createflight.component';
import { StatsComponent } from './stats/stats.component';
import {AdminComponent} from "../admin/admin.component";
import {EditActivityComponent} from "../component/edit-activity/edit-activity.component";
import {AdminactivityComponent} from "../component/adminactivity/adminactivity.component";
import {ActivityFormComponent} from "../component/activity-form/activity-form.component";
import {AdmindestinationComponent} from "../component/admindestination/admindestination.component";
import {DestinationFormComponent} from "../component/destination-form/destination-form.component";
import {EditdestinationComponent} from "../component/editdestination/editdestination.component";
import {AdmineventsComponent} from "../component/adminevents/adminevents.component";
import {AddeventComponent} from "../component/addevent/addevent.component";
import {EventDetailsComponent} from "../component/event-details/event-details.component";
import {EditEventComponent} from "../component/edit-event/edit-event.component";

import { AddproduitComponent } from './boutique/produit/addproduit/addproduit.component';
import { ListproduitComponent } from './boutique/produit/listproduit/listproduit.component';
import { UpdateproduitComponent } from './boutique/produit/updateproduit/updateproduit.component';
import { ListorderComponent } from './boutique/commande/listorder/listorder.component';
import { UpdateorderComponent } from './boutique/commande/updateorder/updateorder.component';

import { ListdeliveryComponent } from './boutique/livraison/listdelivery/listdelivery.component';
import { UpdatedeliveryComponent } from './boutique/livraison/updatedelivery/updatedelivery.component';
import { AddDeliveryComponent } from './boutique/livraison/adddelivery/adddelivery.component';
import { StatistiquesComponent } from './boutique/statistiques/statistiques.component';
import { AuthGuardS } from 'src/app/services/gestionUser/guards/AuthguardS';

const routes: Routes = [



    //Sahar
    //Sahar-back
    //Sahar-User-back
    { path: 'users', component: UserListComponentComponent }, //list
    { path: 'createuser', component: CreateUserComponent }, //create
    { path: 'user/update/:id', component: UpdateUserComponent },//update
    { path: 'user/:id', component: UserDetailsComponent },//detail
    //Sahar-Partner-back
    { path: 'partners', component: PartnerListComponent }, //list
    { path: 'createpartner', component: CreatePartnerComponent },//create
    { path: 'partner/update/:id', component: UpdatePartnerComponent },//update
    { path: 'partner/:id', component: PartnerDetailsComponent },//detail
    //sahar-preferences-back
    { path: 'preferences', component: PreferencesListComponent }, //list
    { path: 'createpreference', component: CreatePreferenceComponent }, //create
    { path: 'preferences/:id', component: ViewPreferenceComponent },//edit
    { path: 'preferences/edit/:id', component: UpdatePreferenceComponent },//edit
    { path: 'partner-services/:id', component: PartnerServicesbackComponent },//edit
    { path: 'partner-clients/:id', component: PartnerClientsbackComponent },//edit
    { path: 'user/selectedservices/:id', component: UserServicesSelectedComponent },//edit
    { path: 'services', component: ServicesListComponent },//edit
    { path: 'service-details/:id', component: ServiceDetailsAdminComponent },//detailf

    {
        path: 'user/preferences/:id', component: UserPreferencesbackComponent
    },
    {
        path: 'myprofileadmin', component: MyprofileadminComponent
    },



    {
        path: "",
        component: DashboardComponent
    },
    //user
    
    //flights
    { path: 'createflight', component: CreateflightComponent },
    { path: 'edit/:id', component: EditFlightComponent }, // 'id' is the flight ID

    {
      path: "listflight",
      component: ListflightComponent
  },{
    path: "reservflight",
    component: ReserveflightComponent
},
{
  path: "reservation-stats",
  component: StatsComponent
},
//destinations


//event



//boutique

//pack
{ path: 'packs', loadChildren: () => import('./gestion-pack/gestion-pack.module').then(m => m.GestionPackModule) },
//paiement
{ path: 'paiement', loadChildren: () => import('./paiement/paiement.module').then(m => m.PaiementBackModule)},
// reward points
 { path: 'reward-points', loadChildren: () => import('./reward-points/reward-points.module').then(m => m.RewardPointsModule)},
//travelqa
{ path: 'travelqa', loadChildren: () => import('./travel-bot/travel-bot.module').then(m => m.TravelBotModule)},
//claim


//community



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
        path: 'destinations/edit/:id',
        component: EditdestinationComponent,  // Main admin content
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
//boutique
    { path: 'back-office/addproduct', component: AddproduitComponent , canActivate: [AuthGuardS]},
    { path: 'back-office/listproduct', component: ListproduitComponent, canActivate: [AuthGuardS] },
    { path: 'back-office/updateproduct/:id', component: UpdateproduitComponent, canActivate: [AuthGuardS] },


    { path: 'back-office/listorder', component: ListorderComponent, canActivate: [AuthGuardS] },
    { path: 'back-office/updateorder/:id', component: UpdateorderComponent, canActivate: [AuthGuardS] },

    { path: 'back-office/adddelivery', component: AddDeliveryComponent, canActivate: [AuthGuardS] },
    { path: 'back-office/listdelivery', component: ListdeliveryComponent , canActivate: [AuthGuardS]},
    { path: 'back-office/updatedelivery/:id', component: UpdatedeliveryComponent , canActivate: [AuthGuardS]},

    { path: 'back-office/shop/statistics', component: StatistiquesComponent , canActivate: [AuthGuardS]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
