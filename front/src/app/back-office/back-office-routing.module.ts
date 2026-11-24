import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office.component';
import { LayoutComponent } from './layouts/layout.component';
import {ListflightComponent} from './pages//listflight/listflight.component'

import {CreateUserComponent} from "../pages/gestionuser/create-user/create-user.component";
import {UpdateUserComponent} from "../pages/gestionuser/update-user/update-user.component";
import {UserListComponentComponent} from "../pages/gestionuser/user-list-component/user-list-component.component";
import {UserDetailsComponent} from "../pages/gestionuser/user-details/user-details.component";
import {PartnerListComponent} from "../pages/gestionuser/partner-list/partner-list.component";
import {CreatePartnerComponent} from "../pages/gestionuser/create-partner/create-partner.component";
import {UpdatePartnerComponent} from "../pages/gestionuser/update-partner/update-partner.component";
import {PartnerDetailsComponent} from "../pages/gestionuser/partner-details/partner-details.component";
import {PreferencesListComponent} from "../pages/gestionuser/preferences-list/preferences-list.component";
import {CreatePreferenceComponent} from "../pages/gestionuser/create-preference/create-preference.component";
import {ViewPreferenceComponent} from "../pages/gestionuser/view-preference/view-preference.component";
import {UpdatePreferenceComponent} from "../pages/gestionuser/update-preference/update-preference.component";

const routes: Routes = [


  // { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  // { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)  },
  // { path: 'pages', loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule), canActivate: [AuthGuard] },
  // { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)},

  //Sahar
    {path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)  },
  { path: 'pages', loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule) },
  { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
