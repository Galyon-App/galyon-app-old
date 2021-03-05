/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubCategoryRoutingModule } from './sub-category-routing.module';
import { SubCategoryComponent } from './sub-category.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SubCategoryComponent],
  imports: [
    CommonModule,
    SubCategoryRoutingModule,
    SharedModule
  ]
})
export class SubCategoryModule { }
