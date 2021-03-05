/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageAdminRoutingModule } from './manage-admin-routing.module';
import { ManageAdminComponent } from './manage-admin.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageAdminComponent],
  imports: [
    CommonModule,
    ManageAdminRoutingModule,
    SharedModule
  ]
})
export class ManageAdminModule { }
