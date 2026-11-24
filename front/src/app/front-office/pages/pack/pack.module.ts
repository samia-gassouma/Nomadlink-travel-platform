import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackRoutingModule } from './pack-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListPacksComponent } from './list-packs/list-packs.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [ ListPacksComponent, PackDetailsComponent],
  imports: [
    CommonModule,
    PackRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class PackModule { }
