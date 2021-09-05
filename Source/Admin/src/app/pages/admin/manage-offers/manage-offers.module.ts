/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
