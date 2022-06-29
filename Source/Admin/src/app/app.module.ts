/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { MerchantComponent } from './layouts/merchant/merchant.component';
import { TitleComponent } from './components/title/title.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LeaveGuard } from './guard/leaved.guard';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import { AgmCoreModule } from '@agm/core';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { OperatorComponent } from './layouts/operator/operator.component';

// 1. Import the libs you need
// import { AngularFireModule } from '@angular/fire';
// import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
// import { AngularFireAuthModule } from '@angular/fire/auth';
//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
//import { NgxSpinnerModule } from 'ngx-spinner';
//import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    OperatorComponent,
    MerchantComponent,
    AuthComponent,
    TitleComponent,
    BreadcrumbsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google.mapApi
    })
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    // 3. Initialize
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAuthModule, // auth
    // AngularFireAnalyticsModule // analytics
  ],
  providers: [
    //LeaveGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
