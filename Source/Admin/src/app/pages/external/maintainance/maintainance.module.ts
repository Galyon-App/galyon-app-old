import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintainanceRoutingModule } from './maintainance-routing.module';
import { MaintainanceComponent } from './maintainance.component';


@NgModule({
  declarations: [MaintainanceComponent],
  imports: [
    CommonModule,
    MaintainanceRoutingModule
  ]
})
export class MaintainanceModule { }
