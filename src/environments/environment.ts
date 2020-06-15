// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  HOST_URL: 'http://localhost:8080',
  //HOST_URL: 'https://api.aate.gob.pe',
  TOKEN_NAME: 'access_token',
  TOKE_USER: 'username',
  PERMISOS: 'permisos',
  REINTENTOS: 3,
  TOKEN_AUTH_USERNAME: 'SISAC',
  TOKEN_AUTH_PASSWORD: 'sisacse2019Aate',

  OAUTH2_REDIRECT_URI: 'http://localhost:4200/oauth2/redirect',
  GOOGLE_AUTH_URL: 'http://localhost:8082/oauth2/authorize/google?redirect_uri=http://localhost:4200/oauth2/redirect',
  FACEBOOK_AUTH_URL: 'http://localhost:8082/oauth2/authorize/facebook?redirect_uri=http://localhost:4200/#/oauth2/redirect',
  GITHUB_AUTH_URL: '/http://localhost:8082/oauth2/authorize/github?redirect_uri=http://localhost:4200/oauth2/redirect'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
