/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstamojocallbackRoutingModule } from './instamojocallback-routing.module';
import { InstamojocallbackComponent } from './instamojocallback.component';


@NgModule({
  declarations: [InstamojocallbackComponent],
  imports: [
    CommonModule,
    InstamojocallbackRoutingModule
  ]
})
export class InstamojocallbackModule { }
