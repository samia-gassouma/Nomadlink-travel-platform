import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPaiementComponent } from './list-paiement/list-paiement.component';
import { PaiementDetailComponent } from './paiement-detail/paiement-detail.component';
import { ListFactureComponent } from './list-facture/list-facture.component';
import { FactureDetailComponent } from './facture-detail/facture-detail.component';

const routes: Routes = [
  {path: 'getAll', component: ListPaiementComponent},
  {path: 'get/:id', component: PaiementDetailComponent},
  {path: 'getAllFactures', component: ListFactureComponent},
  {path: 'getFacture/:id', component: FactureDetailComponent},
  {path: 'getAllFactures/:id', component: ListFactureComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementRoutingModule { }
