/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageDriversRoutingModule } from './manage-drivers-routing.module';
import { ManageDriversComponent } from './manage-drivers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  declarations: [ManageDriversComponent],
  imports: [
    CommonModule,
    ManageDriversRoutingModule,
    SharedModule,
    GooglePlaceModule
  ]
})
export class ManageDriversModule { }
