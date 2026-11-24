import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaiementRoutingModule } from './paiement-routing.module';
import { ListPaiementComponent } from './list-paiement/list-paiement.component';
import { ListFactureComponent } from './list-facture/list-facture.component';
import { PaiementDetailComponent } from './paiement-detail/paiement-detail.component';
import { FactureDetailComponent } from './facture-detail/facture-detail.component';


@NgModule({
  declarations: [
    ListPaiementComponent,
    ListFactureComponent,
    PaiementDetailComponent,
    FactureDetailComponent],
  imports: [
    CommonModule,
    PaiementRoutingModule
  ],
  exports: [
    ListPaiementComponent,
    ListFactureComponent,
    PaiementDetailComponent,
    FactureDetailComponent
  ]
})
export class PaiementBackModule { }
