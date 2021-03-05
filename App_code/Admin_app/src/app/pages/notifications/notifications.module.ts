/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule
  ]
})
export class NotificationsModule { }
