/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageUsersComponent } from './manage-users.component';


const routes: Routes = [
  {
    path: '',
    component: ManageUsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUsersRoutingModule { }
