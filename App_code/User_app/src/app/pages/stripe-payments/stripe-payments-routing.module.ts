/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripePaymentsPage } from './stripe-payments.page';

const routes: Routes = [
  {
    path: '',
    component: StripePaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripePaymentsPageRoutingModule { }
