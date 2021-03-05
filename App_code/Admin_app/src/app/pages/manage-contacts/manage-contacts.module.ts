/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageContactsRoutingModule } from './manage-contacts-routing.module';
import { ManageContactsComponent } from './manage-contacts.component';


@NgModule({
  declarations: [ManageContactsComponent],
  imports: [
    CommonModule,
    ManageContactsRoutingModule
  ]
})
export class ManageContactsModule { }
