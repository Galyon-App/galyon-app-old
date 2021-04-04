/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
