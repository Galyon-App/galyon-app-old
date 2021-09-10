import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageAddressRoutingModule } from './manage-address-routing.module';
import { ManageAddressComponent } from './manage-address.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageAddressComponent],
  imports: [
    CommonModule,
    ManageAddressRoutingModule,
    SharedModule
  ]
})
export class ManageAddressModule { }
