import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainModalPage } from './main-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MainModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainModalPageRoutingModule {}
