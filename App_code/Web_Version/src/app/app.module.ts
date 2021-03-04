/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { UsersComponent } from './layouts/users/users.component';
import { ErrorsComponent } from './layouts/errors/errors.component';
import { HeadersComponent } from './shared/headers/headers.component';
import { FootersComponent } from './shared/footers/footers.component';
import { MenuComponent } from './shared/menu/menu.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BlankComponent } from './layouts/blank/blank.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeadlineComponent } from './shared/headline/headline.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { LeaveGuard } from './leaved/leaved.guard';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    ErrorsComponent,
    HeadersComponent,
    FootersComponent,
    MenuComponent,
    BlankComponent,
    HeadlineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToasterModule.forRoot(),
    NgxUiLoaderModule,
    NgxSkeletonLoaderModule,
    NgOtpInputModule,
    IvyCarouselModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgbModule
  ],
  providers: [LeaveGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
