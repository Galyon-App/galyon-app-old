/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSettingsRoutingModule } from './app-settings-routing.module';
import { AppSettingsComponent } from './app-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AppSettingsComponent],
  imports: [
    CommonModule,
    AppSettingsRoutingModule,
    SharedModule
  ]
})
export class AppSettingsModule { }
