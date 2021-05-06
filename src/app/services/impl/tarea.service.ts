import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Documento} from '../../models';
import { Cancelacion } from 'src/app/models/cancelacion';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiEndPoint: string;
  private apiEndpointExcel: string;
  private interruptorFuente = new BehaviorSubject(false);
  private documentoFuente = new BehaviorSubject(new Documento());
  private cambioDocumentoFuente = new BehaviorSubject(false);
  public documento = this.documentoFuente.asObservable();
  public interruptor = this.interruptorFuente.asObservable();
  public cambioDocumentoInput = this.cambioDocumentoFuente.asObservable();

  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.serviceEndpoint;
    this.apiEndpointExcel = environment.serviceEndpoint + '/cancelacion/plazo.xls';
  }

  cambioDocumento(documento: Documento) {
    this.documentoFuente.next(documento);
  }

  cambioInterruptor(interruptor: boolean) {
    this.interruptorFuente.next(interruptor);
  }
  
  cambioDocumentoValida(cambioDocumento:boolean){
    this.cambioDocumentoFuente.next(cambioDocumento);
  }
  /*Exportar Excel*/
  generarExcel(parametros: Map<string, any>) {
    
      let params: HttpParams = new HttpParams()
      parametros.forEach((value, key) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    const url = `${this.apiEndpointExcel}`;    
    return this.http.get(url, {responseType: 'arraybuffer', params: params});
  }
  /*Exportar Excel*/
  obtenerSolicitudes(parametros: Map<string, any>): Observable<any> {
    
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion';
    let parametrosHttp: HttpParams = new HttpParams();
    
    parametros.forEach((value, key) => {
      if (value) {
        parametrosHttp = parametrosHttp.set(key, value);
      }
    });
    return this.http.get(requestUrl, {params: parametrosHttp});
  }

  obtenerSolicitudesReporte(parametros: Map<string, any>): Observable<any> {
    
    const requestUrl = this.apiEndPoint + '/tarea/cancelacionReporte';
    let parametrosHttp: HttpParams = new HttpParams();
    
    parametros.forEach((value, key) => {
      if (value) {
        parametrosHttp = parametrosHttp.set(key, value);
      }
    });
    return this.http.get(requestUrl, {params: parametrosHttp});
  }

  obtenerListaAprobacionCancelacion(parametros: Map<string, any>): Observable<any> {
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion/aprobacion';
    let parametrosHttp: HttpParams = new HttpParams();
    
    parametros.forEach((value, key) => {
      if (value) {
        parametrosHttp = parametrosHttp.set(key, value);
      }
    });
    return this.http.get(requestUrl, {params: parametrosHttp});
  }

  obtenerListaEjecucionCancelacion(parametros: Map<string, any>): Observable<any> {
    
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion/ejecucion';
    let parametrosHttp: HttpParams = new HttpParams();
    
    parametros.forEach((value, key) => {
      if (value) {
        parametrosHttp = parametrosHttp.set(key, value);
      }
    });
    return this.http.get(requestUrl, {params: parametrosHttp});
  }

  crearSolicitudCancelacion(archivo:any, cancelacion:Cancelacion): Observable<any>{
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion';
    const formData: FormData = new FormData();
    
    if(archivo != undefined && archivo != null){
      formData.append('file', archivo, archivo.name);
    }else{
      formData.append('file',null);
    }

    const blobCancelacion = new Blob([JSON.stringify(cancelacion)], {
      type: "application/json"
    });

    formData.append('cancelacion', blobCancelacion);
    return this.http.post(requestUrl,formData);
  }

  crearEnviarSolicitudCancelacion(archivo:any, cancelacion:Cancelacion): Observable<any>{
    
    const requestUrl = this.apiEndPoint + '/tarea/enviarSolicitudCancelacion';
    const formData: FormData = new FormData();
    
    if(archivo != undefined && archivo != null){
      formData.append('file', archivo, archivo.name);
    }else{
      formData.append('file',null);
    }

    const blobCancelacion = new Blob([JSON.stringify(cancelacion)], {
      type: "application/json"
    });

    formData.append('cancelacion', blobCancelacion);
    return this.http.post(requestUrl,formData);
  }

  actualizarSolicitudCancelacion(archivo:any, cancelacion:Cancelacion): Observable<any>{
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion';
    const formData: FormData = new FormData();
    
    if(archivo != undefined && archivo != null){
      formData.append('file', archivo, archivo.name);
    }else{
      formData.append('file',null);
    }

    const blobCancelacion = new Blob([JSON.stringify(cancelacion)], {
      type: "application/json"
    });

    formData.append('cancelacion', blobCancelacion);
    return this.http.put(requestUrl,formData);
  }

  actualizarEnviarSolicitudCancelacion(archivo:any, cancelacion:Cancelacion): Observable<any>{
    const requestUrl = this.apiEndPoint + '/tarea/enviarSolicitudCancelacion';
    const formData: FormData = new FormData();
    
    if(archivo != undefined && archivo != null){
      formData.append('file', archivo, archivo.name);
    }else{
      formData.append('file',null);
    }

    const blobCancelacion = new Blob([JSON.stringify(cancelacion)], {
      type: "application/json"
    });

    formData.append('cancelacion', blobCancelacion);
    return this.http.put(requestUrl,formData);
  }

  obtenerSolicitudCancelacionPorId(idSolicitudCancelacion){
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion/obtenerSolicitudCancelacion/'+idSolicitudCancelacion;
    return this.http.get(requestUrl);

  }

  aprobarSolicitudCancelacion(cancelacion:Cancelacion){
    
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion/aprobarSolicitudCancelacion';
    return this.http.post(requestUrl,cancelacion);

  }

  rechazarSolicitudCancelacion(cancelacion:Cancelacion){
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion/rechazarSolicitudCancelacion';
    return this.http.post(requestUrl,cancelacion);

  }

  ejecutarCancelacion(cancelacion:Cancelacion){
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion/cancelarDocumento';
    return this.http.post(requestUrl,cancelacion);

  }

  obtenerRutaDocCopiaControlada(idDocumento:any){
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion/obtenerRutaCopiaControladaDocumento/'+idDocumento;
    return this.http.get(requestUrl);
  }

  obtenerDocumentosJerarquicos(idDocumento:any){
    const requestUrl = this.apiEndPoint + '/tarea/documentosjerarquicos/'+idDocumento;
    return this.http.get(requestUrl);
  }

  obtenerCantidadSolicitudesCancelacion(idDocumento:any){
    const requestUrl = this.apiEndPoint + '/tarea/cancelacion/cantidadsolicitudes/'+idDocumento;
    return this.http.get(requestUrl);
  }

}
