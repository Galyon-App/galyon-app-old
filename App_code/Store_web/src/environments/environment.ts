/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: 'https://api.galyon.dev/',
  mediaURL: 'https://api.galyon.dev/uploads/',
  onesignal: {
    appId: 'YOUR_APP_ID',
    googleProjectNumber: 'YOUR_PROJECT_ID',
    restKey: 'YOUR_PROJECT_REST_KEY'
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
