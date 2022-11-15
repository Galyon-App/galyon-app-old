import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RafflePage } from './raffle.page';

const routes: Routes = [
  {
    path: '',
    component: RafflePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RafflePageRoutingModule {}
