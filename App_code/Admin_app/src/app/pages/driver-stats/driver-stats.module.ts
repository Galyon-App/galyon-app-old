/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
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
