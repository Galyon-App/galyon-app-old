/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
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
