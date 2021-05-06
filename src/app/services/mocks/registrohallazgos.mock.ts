import { IRegistroHallazgosService } from "../interfaces/iregistrohallazgos.service";
import { Response } from './../../models/response';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as data from "./registrohallazgos.json";
import * as dataEstados from "./estadoslistaverificacion.json";
import * as dataAuditores from "./auditores.json";
import * as dataNodosRequisitos from "./requisitoslistaverificacion.json";
import * as dataDatosRequisitos from "./datosrequisito.json";
import * as dataCriterioResultado from "./criterioresultado.json";
import * as dataTipoHallazgo from "./tipohallazgo.json";

@Injectable({
    providedIn: 'root',
})
export class RegistroHallazgoMockService implements IRegistroHallazgosService{
    buscarPorParametros(parametros: {estado?: string}, pagina: number, registros: number) {
        const response = new Response();
        response.estado = 'OK';
        let listHallazgosAux = (<any>data).listaHallazgos;
        listHallazgosAux.forEach(obj => {
            obj.fechaCreacion = new Date();
        });
        response.resultado = listHallazgosAux
        return Observable.of(response);
    }

    buscarPorCodigo(codigo:string){
        const response = new Response();
        response.estado = 'OK';
        let lista:any[] = (<any>data).listaHallazgos;
        let obj:any = {};
        for(let i:number=0; lista.length > i; i++){
            if(lista[i].idHallazgo == codigo){
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

    obtenerAuditoresHallazgo(codigo){
        const response = new Response();
        response.estado = 'OK';
        let listaAuditores:any[] = (<any>dataAuditores).listaAuditores;
        response.resultado = listaAuditores.filter(obj => (obj.idAuditor == "2" || obj.idAuditor == "3"));
        return Observable.of(response);
    }

    obtenerRequisitosAuditoria(codigo:string){
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

    obtenerCriterios(codigo:string){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>dataCriterioResultado).listaCriterioResultado;
        return Observable.of(response);
    }

}