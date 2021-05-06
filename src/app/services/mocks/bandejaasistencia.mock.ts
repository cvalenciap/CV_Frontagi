import { IBandejaAsistenciaService } from "../interfaces/ibandejaasistencia.service";
import { Injectable } from "@angular/core";
import {Response} from '../../models';
import { Observable } from "rxjs";
import * as dataAsistencia from "./bandejaasistencia.json";
import * as dataDetalleAsistencia from "./detalleasistencia.json";
import * as dataEntidades from "./entidades.json";
import { Auditoria } from "src/app/models/auditoria";
import { BandejaAsistencia } from "src/app/models/bandejaAsistencia";
import { DetalleAsistencia } from "src/app/models/detalleasistencia";

@Injectable({
    providedIn: 'root',
})
export class BandejaAsistenciaMockService implements IBandejaAsistenciaService{

    buscarAsistencia(pagina: number, registros: number){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataAsistencia).listaBandejaAsistencia;
        return Observable.of(response);
    }
    
    buscarDetalleAsistencia(codigoCapacitacion: string){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataDetalleAsistencia).listaDetalleAsistencia;
        return Observable.of(response);
    }
}