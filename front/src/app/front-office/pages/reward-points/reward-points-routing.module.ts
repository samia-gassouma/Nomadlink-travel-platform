import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetPointsByUserComponent } from './get-points-by-user/get-points-by-user.component';
import { ListPointsComponent } from './list-points/list-points.component';

const routes: Routes = [
  {path:'get/:id', component:GetPointsByUserComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardPointsRoutingModule { }
