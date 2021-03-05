/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageAppRoutingModule } from './manage-app-routing.module';
import { ManageAppComponent } from './manage-app.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageAppComponent],
  imports: [
    CommonModule,
    ManageAppRoutingModule,
    SharedModule
  ]
})
export class ManageAppModule { }
