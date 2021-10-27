import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocatorPage } from './locator.page';

const routes: Routes = [
  {
    path: '',
    component: LocatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocatorPageRoutingModule {}
