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

import { TopPickedPageRoutingModule } from './top-picked-routing.module';

import { TopPickedPage } from './top-picked.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopPickedPageRoutingModule
  ],
  declarations: [TopPickedPage]
})
export class TopPickedPageModule { }
