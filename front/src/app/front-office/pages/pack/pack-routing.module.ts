import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPacksComponent } from './list-packs/list-packs.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';

const routes: Routes = [
  {path: 'getAll',component:ListPacksComponent},
  {path: 'get/:id', component:PackDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackRoutingModule { }
