/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }
