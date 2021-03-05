/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { SetupComponent } from './setup.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SetupComponent],
  imports: [
    CommonModule,
    SetupRoutingModule,
    SharedModule
  ]
})
export class SetupModule { }
