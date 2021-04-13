import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key='+environment.google.mapApi+'&libraries=places&language=en';
document.head.appendChild(script);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
