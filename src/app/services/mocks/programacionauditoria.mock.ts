import { IProgramacionAuditoriaService } from "../interfaces/iprogramacionauditoria.service";
import { Injectable } from "@angular/core";
//import { ProgramacionAuditoria } from "./../../models/programacionauditoria";
import {Response} from '../../models';
import { Observable } from "rxjs";
import * as data from "./programacionauditoria.json";
import * as dataNormas from "./listaNormas.json";
import * as dataDetalle from "./detalleprogramacion.json";
import * as dataMeses from "./listaMeses.json";
import * as dataEntidades from "./entidades.json";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";
import { Programa } from "src/app/models/programa";
import { Auditoria } from "src/app/models/auditoria";


@Injectable({
    providedIn: 'root',
})
export class ProgramacionAuditoriaMockService implements IProgramacionAuditoriaService{
    crear(): Programa {
        const programacion = new Programa();
        return programacion;
    }

    obtenerTipos() {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaProgramacion;
        return Observable.of(response);
    }

    buscarPorParametros(parametros: {codigo?: string, fecha?: string, descripcion?: string}, pagina: number, registros: number) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaProgramacion;
        return Observable.of(response);
    }

    buscarPorCodigo(codigo: number) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaProgramacion[codigo - 1];
        let listaBusqueda:Programa[] = (<any>data).listaProgramacion;
        let objetoEncontrado:Programa = null
        for(let i:number = 0;listaBusqueda.length>i;i++){
            let obj:Programa = listaBusqueda[i];
            if(obj.idPrograma == codigo){
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
    }
}