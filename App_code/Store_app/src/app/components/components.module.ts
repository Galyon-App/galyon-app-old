/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
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
