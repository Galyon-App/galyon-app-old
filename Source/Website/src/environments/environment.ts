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
    apiKey: "AIzaSyCmJaB6O6et28ChK2yACmGEjV-i0f3UbN4",
    authDomain: "spartan-figure-294709.firebaseapp.com",
    projectId: "spartan-figure-294709",
    storageBucket: "spartan-figure-294709.appspot.com",
    messagingSenderId: "101960398024",
    appId: "1:101960398024:web:289b9be1893c9de36761fd",
    measurementId: "G-6C0X9Y777H"
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
    playstore: 'https://play.google.com/store/apps/dev?id=5394145917362507576',
    appstore: 'https://www.apple.com/app-store/'
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
