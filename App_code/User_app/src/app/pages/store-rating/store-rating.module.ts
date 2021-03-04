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
