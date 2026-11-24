import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RewardPointsRoutingModule } from './reward-points-routing.module';
import { UpdateRewardPointsComponent } from './update-reward-points/update-reward-points.component';
import { FormModule } from '../form/form.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [UpdateRewardPointsComponent],
  imports: [
    CommonModule,
    RewardPointsRoutingModule, 
    FormModule,
    ReactiveFormsModule
  ]
})
export class RewardPointsModule { }
