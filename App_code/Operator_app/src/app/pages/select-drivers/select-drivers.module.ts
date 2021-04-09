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

import { SelectDriversPageRoutingModule } from './select-drivers-routing.module';

import { SelectDriversPage } from './select-drivers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectDriversPageRoutingModule
  ],
  declarations: [SelectDriversPage]
})
export class SelectDriversPageModule { }
