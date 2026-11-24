import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { ListDiscountsComponent } from './list-discounts/list-discounts.component';
import { DiscountDetailComponent } from './discount-detail/discount-detail.component';

const routes: Routes = [
  {path: 'add', component:AddDiscountComponent},
  {path: 'getAll', component:ListDiscountsComponent},
  {path: 'update/:id', component:AddDiscountComponent},
  {path: 'get/:id', component:DiscountDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
