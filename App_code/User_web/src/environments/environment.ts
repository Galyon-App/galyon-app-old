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
  baseURL: 'https://api.galyon.dev/',
  mediaURL: 'https://api.galyon.dev/uploads/',
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
    appId: 'YOUR_APP_ID',
    googleProjectNumber: 'YOUR_PROJECT_ID',
    restKey: 'YOUR_PROJECT_REST_KEY'
  },
  general: {
    symbol: '$',
    code: 'USD'
  },
  authToken: '123456789',
  social: {
    fb: 'https://www.facebook.com/bytescrafter/',
    twitter: 'https://twitter.com/bytescrafter',
    youtube: 'https://www.youtube.com/channel/UCHXZUImmr9aSKmYpKXqN9vQ',
    playstore: 'https://play.google.com/store/apps/dev?id=5394145917362507576'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
