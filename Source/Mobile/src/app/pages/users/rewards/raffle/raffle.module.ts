import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RafflePageRoutingModule } from './raffle-routing.module';

import { RafflePage } from './raffle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RafflePageRoutingModule
  ],
  declarations: [RafflePage]
})
export class RafflePageModule {}
