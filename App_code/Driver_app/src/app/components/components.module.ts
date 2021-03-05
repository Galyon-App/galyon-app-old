/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClosedComponent } from './closed/closed.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
const components = [
  ClosedComponent
];

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    ...components,
  ]
})
export class ComponentsModule { }
