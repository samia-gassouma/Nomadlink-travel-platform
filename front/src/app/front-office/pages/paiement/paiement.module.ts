import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaiementRoutingModule } from './paiement-routing.module';
import { PaiementBackModule } from 'src/app/back-office/pages/paiement/paiement.module';
import { PaiementByUserComponent } from './paiement-by-user/paiement-by-user.component';
import { ListFactureByUserComponent } from './list-facture-by-user/list-facture-by-user.component';
import { FactureDetailComponent } from './facture-detail/facture-detail.component';
import { PaiementDetailComponent } from './paiement-detail/paiement-detail.component';
import { SharedModule } from '../../shared/shared.module';
import {CancelComponent} from "./cancel/cancel.component";
import {SuccessComponent} from "./success/success.component";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    PaiementByUserComponent,
    ListFactureByUserComponent,
    PaiementDetailComponent,
    FactureDetailComponent,
      CancelComponent,
      SuccessComponent
  ],
  imports: [
    CommonModule,
    PaiementRoutingModule,
    PaiementBackModule,
    SharedModule,
      RouterModule
  ]
})
export class PaiementModule { }
