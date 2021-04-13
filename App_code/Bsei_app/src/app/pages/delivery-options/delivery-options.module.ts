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

import { DeliveryOptionsPageRoutingModule } from './delivery-options-routing.module';

import { DeliveryOptionsPage } from './delivery-options.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryOptionsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DeliveryOptionsPage]
})
export class DeliveryOptionsPageModule { }
