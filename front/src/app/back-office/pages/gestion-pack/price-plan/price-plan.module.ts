import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricePlanRoutingModule } from './price-plan-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPricePlanComponent } from './add-price-plan/add-price-plan.component';
import { ListPricePlansComponent } from './list-price-plans/list-price-plans.component';
import { PricePlanDetailsComponent } from './price-plan-details/price-plan-details.component';


@NgModule({
  declarations: [AddPricePlanComponent,ListPricePlansComponent, PricePlanDetailsComponent],
  imports: [
    CommonModule,
    PricePlanRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PricePlanModule { }
