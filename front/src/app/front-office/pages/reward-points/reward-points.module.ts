import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardPointsRoutingModule } from './reward-points-routing.module';
import { ListPointsComponent } from './list-points/list-points.component';
import { GetPointsByUserComponent } from './get-points-by-user/get-points-by-user.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [ListPointsComponent,GetPointsByUserComponent],
  imports: [
    CommonModule,
    RewardPointsRoutingModule,
    SharedModule
  ]
})
export class RewardPointsModule { }
