/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailsDetailsRoutingModule } from './emails-details-routing.module';
import { EmailsDetailsComponent } from './emails-details.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [EmailsDetailsComponent],
  imports: [
    CommonModule,
    EmailsDetailsRoutingModule,
    SharedModule,
    CKEditorModule
  ]
})
export class EmailsDetailsModule { }
