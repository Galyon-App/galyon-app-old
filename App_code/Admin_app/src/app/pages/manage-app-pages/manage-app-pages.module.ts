/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAppPagesRoutingModule } from './manage-app-pages-routing.module';
import { ManageAppPagesComponent } from './manage-app-pages.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CKEditorModule } from 'ng2-ckeditor';


@NgModule({
  declarations: [ManageAppPagesComponent],
  imports: [
    CommonModule,
    ManageAppPagesRoutingModule,
    SharedModule,
    CKEditorModule
  ]
})
export class ManageAppPagesModule { }
