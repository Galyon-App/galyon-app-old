/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlutterwavecallbackComponent } from './flutterwavecallback.component';


const routes: Routes = [
  {
    path: '',
    component: FlutterwavecallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlutterwavecallbackRoutingModule { }
