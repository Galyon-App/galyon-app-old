/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
import { SplashComponent } from './splash/splash.component';

const components = [
    TimeComponent,
    PopoverComponent,
    FiltersComponent,
    ClosedComponent,
    SplashComponent
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
