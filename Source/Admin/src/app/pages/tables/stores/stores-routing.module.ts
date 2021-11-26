/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoresComponent } from './stores.component';


const routes: Routes = [
  {
    path: '',
    component: StoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresRoutingModule { }
