import { IPlanAuditoriaService } from "../interfaces/iplanauditoria.service";
import { Injectable } from "@angular/core";
import { Response } from './../../models/response';
//import { PlanAuditoria } from "src/app/models/planauditoria";
import { Observable } from "rxjs";
import * as data from "./planauditoria.json";
import * as dataRequisitos from "./requisitosauditoria.json";
import * as dataConsideraciones from "./consideracionesplan.json";
import * as dataAuditores from "./auditores.json";
import * as dataEntidades from "./entidades.json";
import * as dataListaRequisitos from "./requisitos.json";

import * as dataListaIncidencias from "./incidencias.json";

import * as dataListaCriterio from "./criterioresultado.json";
import * as dataParametros from "./parametrosbandejaplan.json";
import * as dataAuditoria from "./datosAuditoria.json";
import { ConsideracionPlan } from "src/app/models/consideracionesplan";
import { Auditoria } from "src/app/models/auditoria";
import { CriterioResultado } from "src/app/models/criterioResultado";


@Injectable({
    providedIn: 'root',
})
export class PlanAuditoriaMockService implements IPlanAuditoriaService{
    crear(): Auditoria {
        const programacion = new Auditoria();
        return programacion;
    }


    buscarPorParametros(parametros: {tipo?: string, detector?: string, estado?: string}, pagina: number, registros: number) {
        const response = new Response();
        response.estado = 'OK';
        let lista:any[] = (<any>data).listaPlanAuditoria;
        lista.forEach( obj => {
            obj.fechaCreacion = new Date();
            obj.fechaInicio = new Date();
            obj.fechaFin = new Date();
        })
        response.resultado = lista;
        return Observable.of(response);
    }

    buscarPorCodigo(codigo: number) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaPlanAuditoria[codigo - 1];
        let listaBusqueda:Auditoria[] = (<any>data).listaPlanAuditoria;
        let objetoEncontrado:Auditoria = null
        for(let i:number = 0;listaBusqueda.length>i;i++){
            let obj:Auditoria = listaBusqueda[i];
            if(obj.idAuditoria == codigo){
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

    guardar(planauditoria: Auditoria) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaPlanAuditoria[0];
        return Observable.of(response);
    }

    eliminar(programacion: Auditoria) {
        const response = new Response();
        response.estado = 'OK';
        return Observable.of(response);
    }

    buscarRequisitos(codigo: string){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataRequisitos).listaRequisitoPlan;
        return Observable.of(response);
    }

    buscarConsideraciones(codigo:string){
        const response = new Response();
        response.estado = 'OK';
        //response.resultado = (<any>dataConsideraciones).listaConsideraciones;
        let listaConsideracionesAux:ConsideracionPlan[] = (<any>dataConsideraciones).listaConsideraciones;
        let listaConsid:ConsideracionPlan[] = [];
        for(let i:number = 0; listaConsideracionesAux.length>i;i++){
            let consideracion:ConsideracionPlan = new ConsideracionPlan();
            //consideracion.idConsideracion = listaConsideracionesAux[i].idConsideracion;
            consideracion.textoConsideracion = listaConsideracionesAux[i].textoConsideracion;
            listaConsid.push(consideracion);
        }
        response.resultado = listaConsid;
        return Observable.of(response);
    }

    buscarAuditores(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataAuditores).listaAuditores;
        return Observable.of(response);
    }

    buscarAuditoresPorParametros(parametros: {nroFicha?: string, apePaterno?: string, apeMaterno?: string, nombres?: string}, pagina: number, registros: number) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataAuditores).listaBusquedaAuditores;
        return Observable.of(response);
    }

    obtenerEntidades(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataEntidades).entidades;
        return Observable.of(response); 
    }

    buscarRequisitosNorma(codigo:string){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataListaRequisitos).listaRequisitos;
        return Observable.of(response); 
    }


    buscarIncidencias(codigo:string){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataListaIncidencias).listaIncidencias;
        return Observable.of(response); 
    }


    buscarCriterioResultado(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataListaCriterio).listaCriterioResultado;
        return Observable.of(response); 
    }

    obtenerTipos(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataParametros).parametros.listaTipos;
        return Observable.of(response); 
    }

    obtenerDetectores(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataParametros).parametros.listaDetectores;
        return Observable.of(response); 
    }

    obtenerEstados(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataParametros).parametros.listaEstados;
        return Observable.of(response); 
    }

    obtenerAuditores(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataParametros).parametros.listaAuditores;
        return Observable.of(response); 
    }

    obtenerObservadores(){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataParametros).parametros.listaObservadores;
        return Observable.of(response); 
    }

    buscarDatosAuditoriaCodigo(codigo:any){
        
        const response = new Response();
        let listaDatosAuditoria: Auditoria[] = (<any>dataAuditoria).listaDatosAuditoria;
        listaDatosAuditoria.forEach(obj => {
            obj.fechaInicio = this.parse(obj.textoFechaInicio);
            obj.fechaFin = this.parse(obj.textoFechaFin);
            obj.anio = this.obtenerAnio(obj.textoFechaInicio);
        });
        let datoAuditoria:Auditoria = listaDatosAuditoria.find(obj => obj.idAuditoria == codigo);
        response.estado = 'OK',
        response.resultado = datoAuditoria;
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

    obtenerAnio(value:any):number {
        if (value.indexOf('/') > -1) {
            const str = value.split('/');
      
            const year = Number(str[2]);

            return year;
        }
    }

    procesar(auditoria:Auditoria){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaPlanAuditoria[0];
        return Observable.of(response);
    }

}