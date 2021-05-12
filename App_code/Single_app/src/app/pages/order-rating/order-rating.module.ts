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

import { OrderRatingPageRoutingModule } from './order-rating-routing.module';

import { OrderRatingPage } from './order-rating.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderRatingPageRoutingModule
  ],
  declarations: [OrderRatingPage]
})
export class OrderRatingPageModule { }
