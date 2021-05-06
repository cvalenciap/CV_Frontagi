import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { IAsistencia } from "src/app/services/interfaces/iasistencia.service";
import {environment} from '../../../environments/environment';
import {Asistencia} from '../../models';
import {EmpleadoAsistencia} from '../../models/empleadoAsistencia';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
  })
 export class AsistenciaService implements IAsistencia {
    private apiEndpoint: string;
    constructor(private http: HttpClient) {    
      this.apiEndpoint = environment.serviceEndpoint + '/asistencia';
    }


    buscarPorAsistencia(asistencia: { codCurso?: string; nomCurso?: string; }, pagina: number, registros: number){
        let url = this.apiEndpoint + `/capacitacion`;
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
        if (asistencia.codCurso) { params = params.set('codCurso', asistencia.codCurso);}
        if (asistencia.nomCurso) { params = params.set('nomCurso', asistencia.nomCurso); }
        return this.http.get(url, {params});
    }
    
    buscarEmpleadoSesion(sesion: { idCurso?: string; idSesion?: string; }){
      let url = this.apiEndpoint + `/empleadoSesion`;
      let params: HttpParams = new HttpParams()
      
      if (sesion.idCurso) { params = params.set('idCurso', sesion.idCurso);}
      if (sesion.idSesion) { params = params.set('idSesion', sesion.idSesion); }
      return this.http.get(url, {params});
  }

   
    actualizar(asistencia: Asistencia): Observable<any> {
      let url = this.apiEndpoint+`/actualizar`;
    return this.http.post(url, asistencia);
    }
    crearDocumento(archivo:any,asistencia: Asistencia): Observable<any>{
     
      const requestUrl = this.apiEndpoint+`/crearDocumento`;
      const formData: FormData = new FormData();
      
      
      if(archivo != undefined && archivo != null){
        formData.append('file', archivo, archivo.name);
      }else{
        formData.append('file',null);
      }


      const blobDocumento = new Blob([JSON.stringify(asistencia)], {
        type: "application/json"
      });


      formData.append('asistencia', blobDocumento);
      return this.http.post(requestUrl,formData);
   /*  return this.http.post(url, asistencia); */
    }
 }