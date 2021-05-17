/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: 'https://brilliant.dev/',
  mediaURL: 'https://brilliant.dev/uploads/',
  firebase: {
    apiKey: "AIzaSyCmJaB6O6et28ChK2yACmGEjV-i0f3UbN4",
    authDomain: "spartan-figure-294709.firebaseapp.com",
    projectId: "spartan-figure-294709",
    storageBucket: "spartan-figure-294709.appspot.com",
    messagingSenderId: "101960398024",
    appId: "1:101960398024:web:8e1e8238771766b56761fd",
    measurementId: "G-TM037WR38V"
  },
  google: {
    mapApi: "AIzaSyDuek6Uyv1OVdrNb75jAiWE6u89YU5W0CY"
  },
  onesignal: {
    appId: '87415a2c-b322-4d70-909f-a3e387c27c8b',
    googleProjectNumber: '601855270346',
    restKey: 'MTU0ZDkxMDctZTk0YS00ZmM2LWIxYmYtNDA1YmU0NWFmNjcz'
  },
  general: {
    symbol: '₱',
    code: 'PHP'
  },
  authToken: '123456789'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
