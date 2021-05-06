import { IListaVerificacionService } from "../interfaces/ilistaverificacion.service";
import { Injectable } from "@angular/core";
import { Response } from './../../models/response';
import { Observable } from "rxjs";
import * as data from "./listaverificacionauditor.json";
import * as dataEstados from "./estadoslistaverificacion.json";
import * as dataNodosRequisitos from "./requisitoslistaverificacion.json";
import * as dataDatosRequisitos from "./datosrequisito.json";

@Injectable({
    providedIn: 'root',
})
export class ListaVerificacionMockService implements IListaVerificacionService{

    buscarPorParametros(parametros: {estado?: string}, pagina: number, registros: number) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaVerificacion;
        let listaVerificacionAux = (<any>data).listaVerificacion;
        listaVerificacionAux.forEach(obj => {
            obj.fechaCreacion = new Date();
        });
        return Observable.of(response);
    }

    buscarPorCodigo(codigo:string){
        const response = new Response();
        response.estado = 'OK';
        let lista:any[] = (<any>data).listaVerificacion;
        let obj:any = {};
        for(let i:number=0; lista.length > i; i++){
            if(lista[i].idListaVerificacion == codigo){
                obj = lista[i];
                break;
            }
        }
        response.resultado = obj;
        return Observable.of(response);


    }

    obtenerEstados(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataEstados).listaEstadosLV;
        return Observable.of(response);
    }

    obtenerRequisitosAuditoria(codigo:number){
        
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataNodosRequisitos).listaRequisitos;
        return Observable.of(response);
    }

    obtenerDatosRequisitos(codigo:string){
        
        const response = new Response();
        response.estado = 'OK';
        let listaDatosRequisitos:any[] = (<any>dataDatosRequisitos).listaDatosRequisito;
        console.log(listaDatosRequisitos);

        response.resultado = listaDatosRequisitos.find( obj => obj.id == codigo);
        console.log(response);
        return Observable.of(response);
    }


}