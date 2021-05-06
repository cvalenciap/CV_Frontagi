import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ICorreoService} from 'src/app/services/interfaces/icorreo.service';
import {Correo} from 'src/app/models/correo';

@Injectable({
  providedIn: 'root',
})

export class CorreoService implements ICorreoService {
  
  private apiEndpointObtenerCorreo: string;
  private apiEndpointObtenerListaCorreo: string;
  private apiEndpointEnviarCorreo: string;

  constructor(private http: HttpClient) {
    this.apiEndpointObtenerCorreo      = environment.serviceEndpoint + '/obtenerCorreo';
    this.apiEndpointObtenerListaCorreo = environment.serviceEndpoint + '/obtenerListaCorreo';
    this.apiEndpointEnviarCorreo       = environment.serviceEndpoint + '/enviarCorreo';
  }

  obtenerCorreo(idDocumento, idOperacion, tipoCorreo) {
    let params: HttpParams = new HttpParams();
    if(idDocumento != null) { params = params.set('idDocumento', idDocumento); }
    if(idOperacion != null) { params = params.set('idOperacion', idOperacion); }
    if(tipoCorreo != null) {  params = params.set('tipoCorreo', tipoCorreo); }
    return this.http.get(this.apiEndpointObtenerCorreo, {params});
  }

  obtenerListaCorreo(idDocumento, idOperacion, tipoCorreo) {
    let params: HttpParams = new HttpParams();
    if(idDocumento != null) { params = params.set('idDocumento', idDocumento); }
    if(idOperacion != null) { params = params.set('idOperacion', idOperacion); }
    if(tipoCorreo != null) {  params = params.set('tipoCorreo', tipoCorreo); }
    return this.http.get(this.apiEndpointObtenerListaCorreo, {params});
  }

  enviarCorreo(correo: Correo) {
    let url = this.apiEndpointEnviarCorreo;
    return this.http.post(url, correo);
  }

}