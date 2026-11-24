import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // Discount
    { path: 'discount', loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule) },
    // Pack
    { path: 'pack', loadChildren: () => import('./pack/pack.module').then(m => m.PackModule) },
    // Price-Plan
    { path: 'price-plan', loadChildren: () => import('./price-plan/price-plan.module').then(m => m.PricePlanModule) },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPackRoutingModule { }
