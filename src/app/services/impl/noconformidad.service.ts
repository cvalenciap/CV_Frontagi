//YPM 
import { Directive, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NoConformidad } from '../../models/noconformidad';
import { Reprogramacion } from '../../models/Reprogramacion';
import { Estado } from '../../models/enums';
import { INoConformidadService } from '../interfaces/inoconformidad.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Paginacion } from 'src/app/models';
import { Ejecucion } from '../../models/ejecucion';

@Injectable({
  providedIn: 'root',
})
export class NoConformidadService implements INoConformidadService {

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = "";
  }
  
  buscarNoConformidad(parametros: { tipoFecha?: string; fechaDesde?: string; fechaHasta?: string; codigo?: string; tipoConformidad?: string; norma?: string; alcance?: string; requisito?: string; origenDeteccion?: string; gerencia?: string; equipo?: string; }, paginacion: Paginacion) {
        
    this.apiEndpoint = environment.serviceEndpoint + '/noConformidad';
    let params: HttpParams = new HttpParams()
      .set('pagina', paginacion.pagina.toString())
      .set('registros', paginacion.registros.toString());
    
    if(parametros.tipoFecha){params = params.set('tipoFecha', parametros.tipoFecha);}
    if(parametros.fechaDesde){params = params.set('fechaDesde', parametros.fechaDesde);}
    if(parametros.fechaHasta){params = params.set('fechaHasta', parametros.fechaHasta);}
    if(parametros.codigo){params = params.set('codigo', parametros.codigo);}
    if(parametros.tipoConformidad){params = params.set('tipoConformidad', parametros.tipoConformidad);}
    if(parametros.norma){params = params.set('norma', parametros.norma);}
    if(parametros.requisito){params = params.set('requisito', parametros.requisito);}
    if(parametros.origenDeteccion){params = params.set('origenDeteccion', parametros.origenDeteccion);}
    if(parametros.gerencia){params = params.set('gerencia', parametros.gerencia);}
    if(parametros.equipo){params = params.set('equipo', parametros.equipo);}

    return this.http.get(this.apiEndpoint, { params });
  }

  buscarNoConformidadSeguimiento(codigo: string, pagina:number,registros:number){
    this.apiEndpoint = environment.serviceEndpoint + '/noConformidadSeguimiento';
    let params: HttpParams = new HttpParams().set('codigo', codigo).set('pagina', pagina.toString()).set('registros', registros.toString());

    return this.http.get(this.apiEndpoint, { params });
  }

  buscarNoConformidadDatos(codigo: string){
    this.apiEndpoint = environment.serviceEndpoint + '/noConformidadDatos';
    let params: HttpParams = new HttpParams().set('codigo', codigo);
    return this.http.get(this.apiEndpoint, { params });
  }

  buscarNorma(){
    this.apiEndpoint = environment.serviceEndpoint + '/norma/obtenerLista';
    let params: HttpParams = new HttpParams()
    .set('tipo', "1")
    return this.http.get(this.apiEndpoint, { params });
  }

  guardarNoConformidadPorEtapas(noConformidad: NoConformidad) {
    this.apiEndpoint = environment.serviceEndpoint + '/noConformidad';
    let url = this.apiEndpoint;
    if (noConformidad.idNoConformidad !== "0") {
        url += `/${noConformidad.idNoConformidad}`;
    }
    return this.http.post(url, noConformidad);
  }

  guardarPlanAccion(idNoConformidad: number, listaPlanAccion: Reprogramacion[]){
    
    this.apiEndpoint = environment.serviceEndpoint + '/planAccion';
    let url = this.apiEndpoint + `/${idNoConformidad}`;
    const jsonPlanAccion = JSON.stringify(listaPlanAccion);
    let objetoRegistroPlanAccion: any = {"listaPlanAccion": jsonPlanAccion};
    return this.http.post(url, objetoRegistroPlanAccion);
  }

  guardarEjecucion(idNoConformidad: number, listaEjecucion: Ejecucion[]){
    this.apiEndpoint = environment.serviceEndpoint + '/ejecucion';
    let url = this.apiEndpoint + `/${idNoConformidad}`;
    const jsonEjecucion = JSON.stringify(listaEjecucion);
    let objetoRegistroEjecucion: any = {"listaEjecucion": jsonEjecucion};
    return this.http.post(url, objetoRegistroEjecucion);
  }
  
  guardarNoConformidadSeguimiento(noConformidad: NoConformidad) {
    this.apiEndpoint = environment.serviceEndpoint + '/insertarNoCoformidadSeguimiento';
    let url = this.apiEndpoint;
    if (noConformidad.idNoConformidad !== "0") {
        url += `/${noConformidad.idNoConformidad}`;
    }
    return this.http.post(url, noConformidad);
  }
}