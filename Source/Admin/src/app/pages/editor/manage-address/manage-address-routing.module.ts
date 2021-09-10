import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAddressComponent } from './manage-address.component';


const routes: Routes = [
  {
    path: '',
    component: ManageAddressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAddressRoutingModule { }
