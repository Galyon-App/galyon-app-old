/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
