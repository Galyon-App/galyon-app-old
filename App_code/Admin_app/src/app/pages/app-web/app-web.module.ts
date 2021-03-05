/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppWebRoutingModule } from './app-web-routing.module';
import { AppWebComponent } from './app-web.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AppWebComponent],
  imports: [
    CommonModule,
    AppWebRoutingModule,
    SharedModule
  ]
})
export class AppWebModule { }
