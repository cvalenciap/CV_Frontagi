// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mockServices: true,
  serviceEndpoint: 'http://sedapal.test:8080/AGI-WebService/api',
  //File Serve
  serviceEndpointAuth: 'http://sedapal.test:8080/AGI-WebService/auth',
  serviceFileServerEndPoint: 'http://sedapal.test:8080/fileserver',
  pathMesaPartes: 'agi',
  pathVideosPlantilla: 'agi/videosplantillas',
  
  
    max_valor_plazo: 999,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
