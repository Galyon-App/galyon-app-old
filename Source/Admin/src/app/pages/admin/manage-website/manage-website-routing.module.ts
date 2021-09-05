import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageWebsiteComponent } from './manage-website.component';


const routes: Routes = [
  {
    path: '',
    component: ManageWebsiteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageWebsiteRoutingModule { }
