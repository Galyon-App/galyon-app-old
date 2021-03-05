/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaytmcallbackRoutingModule } from './paytmcallback-routing.module';
import { PaytmcallbackComponent } from './paytmcallback.component';


@NgModule({
  declarations: [PaytmcallbackComponent],
  imports: [
    CommonModule,
    PaytmcallbackRoutingModule
  ]
})
export class PaytmcallbackModule { }
