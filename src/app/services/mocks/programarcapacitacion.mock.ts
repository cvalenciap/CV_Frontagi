import { IProgramarCapacitacionService } from "../interfaces/iprogramarcapacitacion.service";
import { Injectable } from "@angular/core";
import {Response} from '../../models';
import { Observable } from "rxjs";
import * as dataCapacitacion from "./programarcapacitacion.json";
//import * as dataDetalleAsistencia from "./detalleasistencia.json";
import * as dataEntidades from "./entidades.json";
import { Auditoria } from "src/app/models/auditoria";
import { ProgramarCapacitacion } from "src/app/models/programarcapacitacion";
//import { DetalleAsistencia } from "src/app/models/detalleasistencia";

@Injectable({
    providedIn: 'root',
})
export class ProgramarCapacitacionMockService implements IProgramarCapacitacionService{

    buscarCapacitacion(pagina: number, registros: number){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataCapacitacion).listaProgramarCapacitacion;
        return Observable.of(response);
    }
    
    /*buscarDetalleAsistencia(codigoCapacitacion: string){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataDetalleAsistencia).listaDetalleAsistencia;
        return Observable.of(response);
    }*/
}