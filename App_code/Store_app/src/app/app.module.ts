/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// translate
import { HttpClientModule } from '@angular/common/http';
import { PipeModule } from './pipes/pipe.module';
import { CategoryPageModule } from './pages/category/category.module';
import { ComponentsModule } from './components/components.module';

import { Camera } from '@ionic-native/camera/ngx';
import { FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Printer } from '@ionic-native/printer/ngx';
import { SelectDriversPageModule } from './pages/select-drivers/select-drivers.module';
import { SubCategoryPageModule } from './pages/sub-category/sub-category.module';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SelectCountryPageModule } from './pages/select-country/select-country.module';
import { VerifyPageModule } from './pages/verify/verify.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        HttpClientModule,
        AppRoutingModule,
        PipeModule,
        CategoryPageModule,
        SubCategoryPageModule,
        SelectDriversPageModule,
        ComponentsModule,
        SelectCountryPageModule,
        VerifyPageModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        FileTransferObject,
        HTTP,
        OneSignal,
        Printer,
        NativeAudio,
        InAppBrowser,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
