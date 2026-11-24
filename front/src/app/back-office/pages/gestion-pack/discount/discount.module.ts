import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRoutingModule } from './discount-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { ListDiscountsComponent } from './list-discounts/list-discounts.component';
import { DiscountDetailComponent } from './discount-detail/discount-detail.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [AddDiscountComponent,ListDiscountsComponent,DiscountDetailComponent],
  imports: [
    CommonModule,
    DiscountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    NgSelectModule,

  ]
})
export class DiscountModule {

 }
