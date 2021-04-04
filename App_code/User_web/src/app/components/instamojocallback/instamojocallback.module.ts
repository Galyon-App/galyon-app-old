/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
