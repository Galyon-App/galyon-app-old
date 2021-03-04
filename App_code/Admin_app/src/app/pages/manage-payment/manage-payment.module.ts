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

import { ManagePaymentRoutingModule } from './manage-payment-routing.module';
import { ManagePaymentComponent } from './manage-payment.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManagePaymentComponent],
  imports: [
    CommonModule,
    ManagePaymentRoutingModule,
    SharedModule
  ]
})
export class ManagePaymentModule { }
