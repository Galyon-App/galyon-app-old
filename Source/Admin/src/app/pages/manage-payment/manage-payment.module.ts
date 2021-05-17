/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
