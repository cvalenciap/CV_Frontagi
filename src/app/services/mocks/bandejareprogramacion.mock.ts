import { IBandejaReprogramacionService } from "../interfaces/ibandejareprogramacion.service";
import { Injectable } from "@angular/core";
import {Response} from '../../models';
import { Observable } from "rxjs";
import * as dataReprogramacion from "./bandejareprogramacion.json";
//import * as dataNormas from "./listaNormas.json";
//import * as dataMeses from "./listaMeses.json";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";
//import { ProgramacionAuditoria } from "./../../models/programacionauditoria";
import * as dataDetallePlanAccion from "./detalleplanaccion.json";
import * as dataEntidades from "./entidades.json";
import { Auditoria } from "src/app/models/auditoria";
import { Reprogramacion } from "src/app/models/reprogramacion";
import { DetalleReprogramacion } from "src/app/models/detallereprogramacion";


@Injectable({
    providedIn: 'root',
})
export class BandejaReprogramacionMockService implements IBandejaReprogramacionService{
    crear(): Reprogramacion {
        const reprogramacion = new Reprogramacion();
        return reprogramacion;
    }

    obtenerTipos() {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataReprogramacion).listaReprogramacion;
        return Observable.of(response);
    }

    buscarReprogramacion(pagina: number, registros: number) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataReprogramacion).listaReprogramacion;
        return Observable.of(response);
    }

    buscarDetallePlanAccion(idDetallePlanAccion: number){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataDetallePlanAccion).listaDetallePlanAccion;
        return Observable.of(response);
    }

    /*buscarPorCodigo(codigo: number) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataReprogramacion).listaReprogramacion[codigo - 1];
        let listaBusqueda:Reprogramacion[] = (<any>dataReprogramacion).listaReprogramacion;
        let objetoEncontrado:Reprogramacion = null
        for(let i:number = 0;listaBusqueda.length>i;i++){
            let obj:Reprogramacion = listaBusqueda[i];
            if(obj.idPlanAccion == codigo){
                objetoEncontrado = obj;
                break;
            }
        }
        if(objetoEncontrado==null){
            response.resultado = null;
        } else {
            response.resultado = objetoEncontrado;
        }
        return Observable.of(response);
    

    guardar(programacion: Programa) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaProgramacion[0];
        return Observable.of(response);
    }

    eliminar(programacion: Programa) {
        const response = new Response();
        response.estado = 'OK';
        return Observable.of(response);
    }

    buscarDetalleProgramacion(codigo: number){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataDetalle).listaAuditorias;
        return Observable.of(response);
    }

    buscarDetalleProgramacionPorCodigo(codigo: number) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataDetalle).listaAuditorias[codigo - 1];
        return Observable.of(response);
    }

    obtenerNormas(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataNormas).listaNormas;
        return Observable.of(response);
    }

    obtenerMeses(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataMeses).listaMeses;
        return Observable.of(response);
    }

    eliminarDetalle(auditoria: Auditoria){
        const response = new Response();
        response.estado = 'OK';
        return Observable.of(response);
    }

    obtenerEntidades(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataEntidades).entidades;
        return Observable.of(response); 
    }*/
}