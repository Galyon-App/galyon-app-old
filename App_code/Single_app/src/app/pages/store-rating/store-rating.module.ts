/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreRatingPageRoutingModule } from './store-rating-routing.module';

import { StoreRatingPage } from './store-rating.page';
import { IonicRatingModule } from 'ionic4-rating';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreRatingPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [StoreRatingPage]
})
export class StoreRatingPageModule { }
