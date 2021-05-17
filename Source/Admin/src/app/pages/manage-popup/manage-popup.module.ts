/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagePopupRoutingModule } from './manage-popup-routing.module';
import { ManagePopupComponent } from './manage-popup.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManagePopupComponent],
  imports: [
    CommonModule,
    ManagePopupRoutingModule,
    SharedModule
  ]
})
export class ManagePopupModule { }
