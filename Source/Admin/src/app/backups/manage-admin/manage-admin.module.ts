/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
