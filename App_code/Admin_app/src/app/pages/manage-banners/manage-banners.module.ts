/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageBannersRoutingModule } from './manage-banners-routing.module';
import { ManageBannersComponent } from './manage-banners.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageBannersComponent],
  imports: [
    CommonModule,
    ManageBannersRoutingModule,
    SharedModule,
  ]
})
export class ManageBannersModule { }
