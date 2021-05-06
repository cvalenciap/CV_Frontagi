import { Directive, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IColaboradoresService } from '../interfaces/icolaboradores.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ColaboradoresService implements IColaboradoresService {

  private apiEndpoint: string;
  private apiEndpoint1: string;
  private apiEndpointAuditoria: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/colaborador';
    this.apiEndpoint1 = environment.serviceEndpoint + '/destinatario';
    this.apiEndpointAuditoria = environment.serviceEndpoint + '/destinatarioAuditor';
  }

  buscarPorParametros(parametros: {
    idDocumento?: string, equipo?: string, funcion?: string,
    responsable?: string, apellidoPaterno?: string, apellidoMaterno?: string, estado?: string
  },
    pagina: number, registros: number) {

    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.idDocumento) { params = params.set('idDocumento', parametros.idDocumento); }
    if (parametros.equipo) { params = params.set('equipo', parametros.equipo); }
    if (parametros.funcion) { params = params.set('funcion', parametros.funcion); }
    if (parametros.responsable) { params = params.set('nombre', parametros.responsable); }
    if (parametros.apellidoPaterno) { params = params.set('apellidoPaterno', parametros.apellidoPaterno); }
    if (parametros.apellidoMaterno) { params = params.set('apellidoMaterno', parametros.apellidoMaterno); }
    if (parametros.estado) { params = params.set('estado', parametros.estado); }

    return this.http.get(this.apiEndpoint, { params });
  }

  /* Auditoria*/
  buscarPorParametrosAuditoria(parametros: {
    idDocumento?: string, equipo?: string, funcion?: string,
    responsable?: string, apellidoPaterno?: string, apellidoMaterno?: string, estado?: string, numeroFicha?: string
  },
    pagina: number, registros: number) {

    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.idDocumento) { params = params.set('idDocumento', parametros.idDocumento); }
    if (parametros.equipo) { params = params.set('equipo', parametros.equipo); }
    if (parametros.funcion) { params = params.set('funcion', parametros.funcion); }
    if (parametros.responsable) { params = params.set('nombre', parametros.responsable); }
    if (parametros.apellidoPaterno) { params = params.set('apellidoPaterno', parametros.apellidoPaterno); }
    if (parametros.apellidoMaterno) { params = params.set('apellidoMaterno', parametros.apellidoMaterno); }
    if (parametros.estado) { params = params.set('estado', parametros.estado); }
    if (parametros.numeroFicha) { params = params.set('numeroFicha', parametros.numeroFicha); }

    return this.http.get(this.apiEndpointAuditoria, { params });
  }


  buscarPorColaborador(parametros: { numeroFicha?: string, nombre?: string, apellidoPaterno?: string, apellidoMaterno?: string, },
    pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());

    if (parametros.numeroFicha) { params = params.set('numeroFicha', parametros.numeroFicha); }
    if (parametros.nombre) { params = params.set('nombre', parametros.nombre); }
    if (parametros.apellidoPaterno) { params = params.set('apellidoPaterno', parametros.apellidoPaterno); }
    if (parametros.apellidoMaterno) { params = params.set('apellidoMaterno', parametros.apellidoMaterno); }
    return this.http.get(this.apiEndpoint, { params });
  }

  buscarDestinatario(parametros: { idDocumento?: number, idSolicitud?: number, equipo?: string, funcion?: string, responsable?: string, estado?: string },
    pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.idDocumento) { params = params.set('idDocumento', parametros.idDocumento.toString()); }
    if (parametros.idSolicitud) { params = params.set('idSolicitud', parametros.idSolicitud.toString()); }
    if (parametros.equipo) { params = params.set('equipo', parametros.equipo); }
    if (parametros.funcion) { params = params.set('funcion', parametros.funcion); }
    if (parametros.responsable) { params = params.set('nombreCompleto', parametros.responsable); }
    if (parametros.estado) { params = params.set('estado', parametros.estado); }
    return this.http.get(this.apiEndpoint1, { params });
  }

  buscarColaborador(parametros: { idDocumento?: string, equipo?: string, funcion?: string, nombre?: string, apellidoPaterno?: string, apellidoMaterno?: string, estado?: string },
    pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.idDocumento) { params = params.set('idDocumento', parametros.idDocumento); }
    if (parametros.equipo) { params = params.set('equipo', parametros.equipo); }
    if (parametros.funcion) { params = params.set('funcion', parametros.funcion); }
    if (parametros.nombre) { params = params.set('nombre', parametros.nombre); }
    if (parametros.apellidoPaterno) { params = params.set('apellidoPaterno', parametros.apellidoPaterno); }
    if (parametros.apellidoMaterno) { params = params.set('apellidoMaterno', parametros.apellidoMaterno); }
    // if (parametros.responsable) { params = params.set('nombreCompleto', parametros.responsable); }
    if (parametros.estado) { params = params.set('estado', parametros.estado); }
    return this.http.get(this.apiEndpoint, { params });
  }

}