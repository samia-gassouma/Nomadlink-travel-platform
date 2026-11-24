import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPointsComponent } from 'src/app/front-office/pages/reward-points/list-points/list-points.component';
import { UpdateRewardPointsComponent } from './update-reward-points/update-reward-points.component';

const routes: Routes = [
    //reward-points
    {path: 'getAll', component: ListPointsComponent},
    {path: 'update/:id', component: UpdateRewardPointsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardPointsRoutingModule { }
