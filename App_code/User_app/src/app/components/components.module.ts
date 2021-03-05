/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/

// This File Is Required For Custom Components

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { TimeComponent } from './time/time.component';
import { PopoverComponent } from './popover/popover.component';
import { FiltersComponent } from './filters/filters.component';
import { ClosedComponent } from './closed/closed.component';

const components = [
    TimeComponent,
    PopoverComponent,
    FiltersComponent,
    ClosedComponent
];
@NgModule({
    declarations: [
        components
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
    ],
    exports: [
        ...components,
    ]
})
export class ComponentsModule { }
