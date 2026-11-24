import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackRoutingModule } from './pack-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPackComponent } from './add-pack/add-pack.component';
import { ListPacksComponent } from './list-packs/list-packs.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [AddPackComponent, ListPacksComponent, PackDetailsComponent],
  imports: [
    CommonModule,
    PackRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class PackModule { }
