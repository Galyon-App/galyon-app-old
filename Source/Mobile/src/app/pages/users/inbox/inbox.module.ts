/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InboxPageRoutingModule } from './inbox-routing.module';

import { InboxPage } from './inbox.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InboxPageRoutingModule
  ],
  declarations: [InboxPage]
})
export class InboxPageModule { }
