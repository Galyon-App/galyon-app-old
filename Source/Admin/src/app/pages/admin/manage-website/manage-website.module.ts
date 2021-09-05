import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageWebsiteRoutingModule } from './manage-website-routing.module';
import { ManageWebsiteComponent } from './manage-website.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageWebsiteComponent],
  imports: [
    CommonModule,
    ManageWebsiteRoutingModule,
    NgMultiSelectDropDownModule,
    SharedModule
  ]
})
export class ManageWebsiteModule { }
