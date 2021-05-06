import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import { DeteccionHallazgos} from 'src/app/models/deteccionhallazgos';
import { Response } from '../../models/response';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs'; 
import {IDeteccionHallazgosService } from "../interfaces/ideteccionhallazgos.service";

import * as data from "./deteccionHallazgos.json";
import * as dataTipos from "./listaTipos.json";
import * as dataOrigenDet from "./listaOrigenDetectado.json";
import * as dataDetector from "./listaDetector.json";
import * as dataEstado from "./listaEstado.json";

import * as dataIncidenciasCombo from "./listaIncidenciasCombo.json";


     
@Injectable({
  providedIn: 'root',
})

export class DeteccionHallazgosMockService implements IDeteccionHallazgosService{
  
  
  crear(): DeteccionHallazgos {
      const deteccionhallazgos = new DeteccionHallazgos();
      return deteccionhallazgos;
  }


  
  eliminar(evaluacionEditor: DeteccionHallazgos) {
    const response = new Response();
    response.estado = 'OK';
    return Observable.of(response);
  }
/*
  buscarPorDeteccionHallazgos(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaDeteccionHallazgos;
    return Observable.of(response);
  }*/

  buscarPorParametros(parametros: {tipo?: string, origenDet?: string,detector?: string,estado?: string}, pagina: number, registros: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaDeteccionHallazgos;
    return Observable.of(response);
}  
     
  buscarPorCodigo(codigo: number) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaDeteccionHallazgos[codigo - 1];
    let listaBusqueda:DeteccionHallazgos[] = (<any>data).listaDeteccionHallazgos;
    let objetoEncontrado:DeteccionHallazgos = null
    for(let i:number = 0;listaBusqueda.length>i;i++){
        let obj:DeteccionHallazgos = listaBusqueda[i];
        if(obj.idDeteccionHallazgo == (codigo+"")){
            objetoEncontrado = obj;
            break;
        }
    }
    if(objetoEncontrado==null){
        response.resultado = null;
    }else{
        response.resultado = objetoEncontrado;
    }
    return Observable.of(response);
}

  buscarPorAuditorias() {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaDeteccionHallazgos;
    return Observable.of(response);
  }
   
  //busqueda avanzada
  obtenerTipos() {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>dataTipos).listaTipos;
    return Observable.of(response);
  }

  obtenerIndicenciasCombo() {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>dataIncidenciasCombo).listaIncidenciasCombo;
    return Observable.of(response);
  }

  obtenerOrigenDet(){
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>dataOrigenDet).listaOrigenDetectado;
    return Observable.of(response);

  }



  obtenerDetector(){
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>dataDetector).listaDetector;
    return Observable.of(response);

  }

  obtenerEstado(){
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>dataEstado).listaEstado;
    return Observable.of(response);

  }



  guardar(evaluacion: DeteccionHallazgos) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaDeteccionHallazgos[0];
    return Observable.of(response);
}
}



