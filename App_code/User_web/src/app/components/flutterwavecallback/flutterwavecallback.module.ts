/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlutterwavecallbackRoutingModule } from './flutterwavecallback-routing.module';
import { FlutterwavecallbackComponent } from './flutterwavecallback.component';


@NgModule({
  declarations: [FlutterwavecallbackComponent],
  imports: [
    CommonModule,
    FlutterwavecallbackRoutingModule
  ]
})
export class FlutterwavecallbackModule { }
