/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguagesComponent } from './languages.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LanguagesComponent],
  imports: [
    CommonModule,
    LanguagesRoutingModule,
    SharedModule
  ]
})
export class LanguagesModule { }
