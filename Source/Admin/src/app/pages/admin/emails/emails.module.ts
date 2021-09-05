/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailsRoutingModule } from './emails-routing.module';
import { EmailsComponent } from './emails.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [EmailsComponent],
  imports: [
    CommonModule,
    EmailsRoutingModule,
    SharedModule
  ]
})
export class EmailsModule { }
