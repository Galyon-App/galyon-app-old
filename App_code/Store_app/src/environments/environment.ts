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
  baseURL: 'http://localhost:8000/',
  mediaURL: 'http://localhost:8000/uploads/',
  firebase: {
    apiKey: "AIzaSyDBieOxlT1pfwVwU1aAwNAVrIJgdul6uRc",
    authDomain: "galyon-app.firebaseapp.com",
    projectId: "galyon-app",
    storageBucket: "galyon-app.appspot.com",
    messagingSenderId: "601855270346",
    appId: "1:601855270346:web:5c5ec298508dcac324c333",
    measurementId: "G-SX0P87PDN1"
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
    symbol: '$',
    code: 'USD'
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
