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
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { PipeModule } from './pipes/pipe.module';


// plugins
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { StoreRatingPageModule } from './pages/store-rating/store-rating.module';
import { ProductRatingPageModule } from './pages/product-rating/product-rating.module';
import { DriverRatingPageModule } from './pages/driver-rating/driver-rating.module';
import { FormsModule } from '@angular/forms';
import { SortPageModule } from './pages/sort/sort.module';
import { VerifyPageModule } from './pages/verify/verify.module';
import { SelectCountryPageModule } from './pages/select-country/select-country.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    PipeModule,
    IonicStorageModule.forRoot(),
    StoreRatingPageModule,
    ProductRatingPageModule,
    DriverRatingPageModule,
    VerifyPageModule,
    SortPageModule,
    FormsModule,
    SelectCountryPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    OneSignal,
    Camera,
    FileTransferObject,
    AndroidPermissions,
    Diagnostic,
    Geolocation,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
