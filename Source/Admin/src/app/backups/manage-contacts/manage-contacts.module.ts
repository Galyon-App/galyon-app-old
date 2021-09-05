/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
