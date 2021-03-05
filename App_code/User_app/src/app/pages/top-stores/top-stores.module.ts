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

import { TopStoresPageRoutingModule } from './top-stores-routing.module';

import { TopStoresPage } from './top-stores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopStoresPageRoutingModule
  ],
  declarations: [TopStoresPage]
})
export class TopStoresPageModule { }
