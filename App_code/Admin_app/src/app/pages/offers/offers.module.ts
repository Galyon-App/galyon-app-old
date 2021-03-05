/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffersRoutingModule } from './offers-routing.module';
import { OffersComponent } from './offers.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [OffersComponent],
  imports: [
    CommonModule,
    OffersRoutingModule,
    SharedModule
  ]
})
export class OffersModule { }
