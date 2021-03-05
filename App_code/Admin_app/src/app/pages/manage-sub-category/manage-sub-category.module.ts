/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageSubCategoryRoutingModule } from './manage-sub-category-routing.module';
import { ManageSubCategoryComponent } from './manage-sub-category.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageSubCategoryComponent],
  imports: [
    CommonModule,
    ManageSubCategoryRoutingModule,
    SharedModule
  ]
})
export class ManageSubCategoryModule { }
