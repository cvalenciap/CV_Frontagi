import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import { IDetalleDeteccionHallazgosService } from '../interfaces/idetalledeteccionhallazgos.service';
import { DetalleDeteccionHallazgos } from 'src/app/models/detalledeteccionhallazgos';
import { DeteccionHallazgos } from 'src/app/models/deteccionhallazgos';

   


@Injectable({
  providedIn: 'root',
})
export class DetalleDeteccionHallazgosService implements IDetalleDeteccionHallazgosService {

  private apiEndpoint:string;
  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/deteccion';
  } 

  
  
  obtenerConstantes(valor?: string){
    let params: HttpParams = new HttpParams()
           .set('ListaConstante', valor)
    let url = this.apiEndpoint + `/listaConstante`;;
     return this.http.get(url+"/", {params});
  }  
 

  buscarPorParametros(parametros: {tipo?: string, origenDet?: string, nombreDetector?: string,apPaternoDetector?: string,apMaternoDetector?: string, estado?: string}, pagina: number, registros: number) {
    /*
    let params: HttpParams = new HttpParams()
      .set('nPagina', pagina.toString())
      .set('nRegistro', registros.toString())
      .set('Estado', parametros.estado)
      .set('NombreDetector', parametros.nombreDetector)
      .set('ApPaternoDetector', parametros.apPaternoDetector)
      .set('ApMaternoDetector', parametros.apMaternoDetector)
      .set('TipoNoConformidad', parametros.tipo)
      .set('TipoOrigenDetec', parametros.origenDet);
*/
let url = this.apiEndpoint+`/obtenerListaDeteccionHallazgo`;
    
      
let params: HttpParams = new HttpParams()
.set('pagina', pagina.toString())
.set('registros', registros.toString());
if (parametros.estado) { params = params.set('estado', parametros.estado); }
if (parametros.nombreDetector) { params = params.set('nombreDetector', parametros.nombreDetector); }
if (parametros.apPaternoDetector) { params = params.set('apPaternoDetector', parametros.apPaternoDetector); }
if (parametros.apMaternoDetector) { params = params.set('apMaternoDetector', parametros.apMaternoDetector); }
if (parametros.tipo) { params = params.set('tipoNoConformidad', parametros.tipo); }
if (parametros.origenDet) { params = params.set('tipoOrigenDetec', parametros.origenDet); }

return this.http.get(url, {params});
  }

  guardar(deteccionhallazgos: DeteccionHallazgos){
    let url = this.apiEndpoint;
    return this.http.post(url, deteccionhallazgos);
  }

  buscarPorCodigo(id: number) {
    const url = `${this.apiEndpoint}/${id}`;
    return this.http.get(url);
  }

 
  // guardar(deteccionhallazgos: DetalleDeteccionHallazgos) {
  //   console.log(deteccionhallazgos.idDetalleDeteccionHallazgos);
  //   let url = this.apiEndpoint;
  //   if (deteccionhallazgos.idDetalleDeteccionHallazgos!== "0") {
  //     url += `/${deteccionhallazgos.idDetalleDeteccionHallazgos}`;
  //   }
  //   return this.http.post(url, deteccionhallazgos);
  // }
//Eliminar Parametro o Constante
  // eliminar(deteccionhallazgos: DetalleDeteccionHallazgos) {
  //   const url = `${this.apiEndpoint}/${deteccionhallazgos.idDetalleDeteccionHallazgos}`;
  //   return this.http.delete(url);
  // }




}

