/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeProductsRoutingModule } from './home-products-routing.module';
import { HomeProductsComponent } from './home-products.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  declarations: [HomeProductsComponent],
  imports: [
    CommonModule,
    HomeProductsRoutingModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    NgxSkeletonLoaderModule,
    Ng5SliderModule
  ]
})
export class HomeProductsModule { }
