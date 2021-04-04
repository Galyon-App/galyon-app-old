/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    SharedModule
  ]
})
export class FaqModule { }
