import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SortPage } from './sort.page';

const routes: Routes = [
  {
    path: '',
    component: SortPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SortPageRoutingModule {}
