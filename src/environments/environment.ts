// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mockServices: true,

  /***********VERSION LOCAL *************/
  serviceEndpoint: 'http://localhost:8080/api',
   serviceEndpointAuth: 'http://localhost:8080/auth', 
   serviceFileServerEndPoint: 'http://sedapal.test:8080/fileserver',
   
   
   
   /*serviceEndpoint: 'http://apin1qa.sedapal.com.pe/agiapi',
   serviceEndpointAuth: 'http://apin1qa.sedapal.com.pe/agiauth',
   serviceFileServerEndPoint: 'http://sedapal.test:8080/fileserver', */


  /* serviceEndpoint:     'http://apitra.sedapal.com.pe/agiapi',
  serviceEndpointAuth:  'http://apitra.sedapal.com.pe/agiauth',
  serviceFileServerEndPoint: 'http://apitra.sedapal.com.pe/fileserver',*/
   

  /********VERSION SERVIDOR CANVIA DESARROLLO*****/
   /* serviceEndpoint: 'http://sedapal.test:8080/AGI-WebService/api',
   serviceEndpointAuth: 'http://sedapal.test:8080/AGI-WebService/auth',    
   serviceFileServerEndPoint: 'http://sedapal.test:8080/fileserver', */
   

    //serviceEndpoint: 'http://prueba.prueba:8080/pruebaServicio/api',
    //serviceEndpointAuth: 'http://prueba.prueba:8080/pruebaServicio/auth',
    //serviceFileServerEndPoint: 'http://prueba.prueba:8080/fileserver',
    

/***********VERSION SERVIDOR SEDAPAL DESARROLLO***********/
    //serviceEndpoint:     'http://1.1.192.115:8080/sedapal-agi-servicio/api',
    //serviceEndpointAuth: 'http://1.1.192.115:8080/sedapal-agi-servicio/auth',
    //serviceFileServerEndPoint: 'http://1.1.192.115:8080/fileserver',

  /***********VERSION SERVIDOR SEDAPAL QA***********/
    //serviceEndpoint: 'http://apin1qa.sedapal.com.pe/agi',
    //serviceEndpointAuth: 'http://apin1qa.sedapal.com.pe/agi',
    //serviceFileServerEndPoint: 'http://apin1qa.sedapal.com.pe/fileserver',
  
  pathMesaPartes: 'agi',
  pathVideosPlantilla: 'agi/videosplantillas',

}