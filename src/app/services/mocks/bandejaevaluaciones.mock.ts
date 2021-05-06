import { IBandejaEvaluacionesService } from "../interfaces/ibandejaevaluaciones.service";
import { Injectable } from "@angular/core";
import {Response} from '../../models';
import * as dataEvaluaciones from "./bandejaevaluaciones.json";
import * as dataDetalleEvaluaciones from "./detalleevaluaciones.json";
import * as dataEntidades from "./entidades.json";
import { Auditoria } from "src/app/models/auditoria";
import { BandejaEvaluaciones } from "src/app/models/bandejaevaluaciones";
import { DetalleEvaluaciones } from "src/app/models/detalleevaluaciones";
import {Asistencia} from '../../models';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
})
export class BandejaEvaluacionesMockService {

    buscarEvaluaciones(pagina: number, registros: number){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataEvaluaciones).listaBandejaEvaluaciones;
        return Observable.of(response);
    }
    
    buscarDetalleEvaluaciones(codigoCapacitacion: string){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataDetalleEvaluaciones).listaDetalleEvaluaciones;
        return Observable.of(response);
    }
 
}