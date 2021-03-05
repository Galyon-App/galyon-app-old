/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriversRoutingModule } from './drivers-routing.module';
import { DriversComponent } from './drivers.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DriversComponent],
  imports: [
    CommonModule,
    DriversRoutingModule,
    SharedModule
  ]
})
export class DriversModule { }
