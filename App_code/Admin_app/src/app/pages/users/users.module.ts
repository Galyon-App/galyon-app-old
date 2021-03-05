/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
  ]
})
export class UsersModule { }
