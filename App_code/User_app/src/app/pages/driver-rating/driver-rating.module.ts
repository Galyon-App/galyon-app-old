/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverRatingPageRoutingModule } from './driver-rating-routing.module';

import { DriverRatingPage } from './driver-rating.page';
import { IonicRatingModule } from 'ionic4-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverRatingPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [DriverRatingPage]
})
export class DriverRatingPageModule { }
