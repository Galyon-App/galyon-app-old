/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopDetailRoutingModule } from './shop-detail-routing.module';
import { ShopDetailComponent } from './shop-detail.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { IvyCarouselModule } from 'angular-responsive-carousel';

@NgModule({
  declarations: [ShopDetailComponent],
  imports: [
    CommonModule,
    ShopDetailRoutingModule,
    IvyCarouselModule,
    MDBBootstrapModule.forRoot(),
  ]
})
export class ShopDetailModule { }