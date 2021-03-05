/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { ManageUsersComponent } from './manage-users.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageUsersComponent],
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
    SharedModule
  ]
})
export class ManageUsersModule { }
