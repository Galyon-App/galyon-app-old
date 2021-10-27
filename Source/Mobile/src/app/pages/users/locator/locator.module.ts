import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocatorPageRoutingModule } from './locator-routing.module';

import { LocatorPage } from './locator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocatorPageRoutingModule
  ],
  declarations: [LocatorPage]
})
export class LocatorPageModule {}
