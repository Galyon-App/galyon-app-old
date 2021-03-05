/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageOffersRoutingModule } from './manage-offers-routing.module';
import { ManageOffersComponent } from './manage-offers.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageOffersComponent],
  imports: [
    CommonModule,
    ManageOffersRoutingModule,
    SharedModule
  ]
})
export class ManageOffersModule { }
