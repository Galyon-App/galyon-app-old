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

import { DriverStatsRoutingModule } from './driver-stats-routing.module';
import { DriverStatsComponent } from './driver-stats.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  declarations: [DriverStatsComponent],
  imports: [
    CommonModule,
    DriverStatsRoutingModule,
    SharedModule,
    NgxPrintModule,
  ]
})
export class DriverStatsModule { }
