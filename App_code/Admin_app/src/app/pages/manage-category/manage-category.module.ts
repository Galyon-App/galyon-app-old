/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCategoryRoutingModule } from './manage-category-routing.module';
import { ManageCategoryComponent } from './manage-category.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageCategoryComponent],
  imports: [
    CommonModule,
    ManageCategoryRoutingModule,
    SharedModule
  ]
})
export class ManageCategoryModule { }
