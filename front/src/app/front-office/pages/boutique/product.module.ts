import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListproductComponent } from './listproduct/listproduct.component';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartproductComponent } from './cartproduct/cartproduct.component';
import { FrontOfficeRoutingModule } from '../../front-office-routing.module';
import { DetailproductComponent } from './detailproduct/detailproduct.component';
import { CommandeComponent } from './commande/commande.component';
import { ReviewComponent } from './review/review.component';
@NgModule({
  declarations: [
    ListproductComponent,
    CartproductComponent,
    DetailproductComponent,
    CommandeComponent,
     ReviewComponent,
   
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbCarouselModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule,
    FrontOfficeRoutingModule,
    NgbModule,
    ReactiveFormsModule,
  

    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    ListproductComponent,
  ReviewComponent
  ]
})
export class ProductModule { }
