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
import { HttpClientModule } from '@angular/common/http';

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
import { StoreRatingPageModule } from './pages/users/store-rating/store-rating.module';
import { ProductRatingPageModule } from './pages/users/product-rating/product-rating.module';
import { DriverRatingPageModule } from './pages/users/driver-rating/driver-rating.module';
import { FormsModule } from '@angular/forms';
import { SortPageModule } from './pages/users/sort/sort.module';
import { VerifyPageModule } from './pages/external/verify/verify.module';
import { SelectCountryPageModule } from './pages/users/select-country/select-country.module';
import { ComponentsModule } from './components/components.module';
import { environment } from 'src/environments/environment';

import { Drivers, Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

import { Printer } from '@ionic-native/printer/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AuthComponent } from './components/auth/auth.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    PipeModule,
    IonicStorageModule.forRoot({
      name: '__bseiapp',
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

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // auth
    AngularFireAnalyticsModule, // analytics,
    AngularFirestoreModule // firestore
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
