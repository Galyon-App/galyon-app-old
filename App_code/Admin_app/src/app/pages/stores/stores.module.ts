/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresRoutingModule } from './stores-routing.module';
import { StoresComponent } from './stores.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [StoresComponent],
  imports: [
    CommonModule,
    StoresRoutingModule,
    SharedModule
  ]
})
export class StoresModule { }
