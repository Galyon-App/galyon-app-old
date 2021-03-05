/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannersRoutingModule } from './banners-routing.module';
import { BannersComponent } from './banners.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [BannersComponent],
  imports: [
    CommonModule,
    BannersRoutingModule,
    SharedModule
  ]
})
export class BannersModule { }
