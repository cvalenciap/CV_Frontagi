import { Injectable } from "@angular/core";
import { IAgrupacionHallazgosService } from "../interfaces/iagrupacionhallazgos.service";
import { Observable } from "rxjs";
import { Response } from './../../models/response';
import * as data from './listanoconformidades.json';
import * as dataParametros from './parametrosagrupacionhallazgos.json';

@Injectable({
    providedIn: 'root',
})
export class AgrupacionHallazgoMockService implements IAgrupacionHallazgosService{
    buscarPorParametros(parametros: {tipo?: string}, pagina: number, registros: number) {
        const response = new Response();
        response.estado = 'OK';
        let listaNoConfirmidades = (<any>data).listaNoConformidades;
        listaNoConfirmidades.forEach(obj => {
            obj.fechaHallazgo = this.parse(obj.fechaHallazgoTexto);        
        });
        response.resultado = listaNoConfirmidades;
        return Observable.of(response);
    }


    obtenerTipoNoConformidad(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataParametros).parametrosAgrupacion.listaTipoNoConformidad;
        return Observable.of(response);
    }

    obtenerEquipos(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataParametros).parametrosAgrupacion.listaEquipos;
        return Observable.of(response);
    }

    parse(value: any): Date {
        if (value.indexOf('/') > -1) {
          const str = value.split('/');
    
          const year = Number(str[2]);
          const month = Number(str[1]) - 1;
          const date = Number(str[0]);
    
          return new Date(year, month, date);
        } 
      }
}