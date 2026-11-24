import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuccessComponent } from './success/success.component';
import { CancelComponent } from './cancel/cancel.component';
import { PaiementByUserComponent } from './paiement-by-user/paiement-by-user.component';
import { PaiementDetailComponent } from './paiement-detail/paiement-detail.component';
import { ListFactureByUserComponent } from './list-facture-by-user/list-facture-by-user.component';
import { FactureDetailComponent } from './facture-detail/facture-detail.component';

const routes: Routes = [
  {path:'success', component: SuccessComponent},
  {path:'cancel', component: CancelComponent},
  {path: 'getAll/:id', component: PaiementByUserComponent},
  {path:'get/:id', component: PaiementDetailComponent},
  {path: 'getAllFactures/:id', component: ListFactureByUserComponent},
  {path: 'getFacture/:id', component: FactureDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementRoutingModule { }
