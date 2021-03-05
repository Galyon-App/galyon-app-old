/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule, WavesModule, CardsModule, IconsModule } from 'angular-bootstrap-md';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardsModule,
    ButtonsModule,
    WavesModule,
    IconsModule,
    NgxSkeletonLoaderModule
  ],
  declarations: [
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CardsModule,
    ButtonsModule,
    WavesModule,
    IconsModule,
    NgxSkeletonLoaderModule
  ],
  providers: [
  ]
})
export class SharedModule { }
