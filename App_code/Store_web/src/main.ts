/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
   if(window){
    window.console.log=function(){};
  }
}

const script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key='+environment.google.mapApi+'&libraries=places&language=en';
document.head.appendChild(script);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
