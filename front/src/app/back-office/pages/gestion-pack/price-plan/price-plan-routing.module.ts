import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPricePlanComponent } from './add-price-plan/add-price-plan.component';
import { ListPricePlansComponent } from './list-price-plans/list-price-plans.component';
import { PricePlanDetailsComponent } from './price-plan-details/price-plan-details.component';

const routes: Routes = [
  {path:'add/:id', component: AddPricePlanComponent},
  {path:'update/:id', component: AddPricePlanComponent},
  {path:'getAll', component: ListPricePlansComponent},
  {path:'get/:id', component: PricePlanDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricePlanRoutingModule { }
