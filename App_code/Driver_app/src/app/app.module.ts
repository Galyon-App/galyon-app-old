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
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PipeModule } from './pipes/pipe.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';
import { Camera } from '@ionic-native/camera/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { VerifyPageModule } from './pages/verify/verify.module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SelectCountryPageModule } from './pages/select-country/select-country.module';
import { environment } from 'src/environments/environment';

// 1. Import the libs you need
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    PipeModule,
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ComponentsModule,
    VerifyPageModule,
    SelectCountryPageModule,

    // 3. Initialize
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // auth
    AngularFireAnalyticsModule // analytics
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    HTTP,
    InAppBrowser,
    OneSignal,
    AndroidPermissions,
    Geolocation,
    NativeAudio,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
