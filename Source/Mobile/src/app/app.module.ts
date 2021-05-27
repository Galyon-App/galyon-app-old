/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
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
import { ComponentsModule } from './components/components.module';
import { environment } from 'src/environments/environment';

import { Drivers, Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

import { Printer } from '@ionic-native/printer/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

// 1. Import the libs you need
// import { AngularFireModule } from '@angular/fire';
// import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
// import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    PipeModule,
    IonicStorageModule.forRoot({
      name: '__bseishop',
      driverOrder: [ Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    StoreRatingPageModule,
    ProductRatingPageModule,
    DriverRatingPageModule,
    VerifyPageModule,
    SortPageModule,
    FormsModule,
    SelectCountryPageModule,
    ComponentsModule,

    // 3. Initialize
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAuthModule, // auth
    // AngularFireAnalyticsModule // analytics
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    Camera,
    Printer,
    FileTransferObject,
    AndroidPermissions,
    Diagnostic,
    Geolocation,
    NativeAudio,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
