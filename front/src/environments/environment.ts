// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:9000/picloud',
  defaultauth: 'fackbackend',

  //ranim
  googleMapsApiKey: 'AIzaSyC1wKazJLCcVLO_TqbWdSGL_sPk74jrNQQ',
  weatherApiKey: 'e0aceaf02872303b61292501651060a7',
  apiUrl: 'http://localhost:9000/picloud', // Your backend URL
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  geminiApiKey: 'AIzaSyDYOwgIJmaSLoCoiKeu42AOgbRGuaQTkRQ'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.