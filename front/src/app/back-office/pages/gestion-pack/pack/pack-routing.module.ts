import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPackComponent } from './add-pack/add-pack.component';
import { ListPacksComponent } from './list-packs/list-packs.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';

const routes: Routes = [
  {path: 'add', component:AddPackComponent},
  {path: 'getAll',component:ListPacksComponent},
  {path: 'get/:id', component:PackDetailsComponent},
  {path: 'update/:id', component:AddPackComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackRoutingModule { }
