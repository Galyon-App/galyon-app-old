/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { OwlModule } from 'ngx-owl-carousel';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    NgxSkeletonLoaderModule,
    OwlModule,
    Ng5SliderModule
  ]
})
export class CategoriesModule { }
