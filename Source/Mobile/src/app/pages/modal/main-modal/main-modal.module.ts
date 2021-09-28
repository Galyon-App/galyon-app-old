import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainModalPageRoutingModule } from './main-modal-routing.module';

import { MainModalPage } from './main-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainModalPageRoutingModule
  ],
  declarations: [MainModalPage]
})
export class MainModalPageModule {}
