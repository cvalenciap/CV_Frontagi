import { IPlanAuditoriaService } from "../interfaces/iplanauditoria.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { Auditoria } from "src/app/models/auditoria";
import { ConsideracionPlan } from "src/app/models/consideracionesplan";
import { CriterioResultado } from "src/app/models/criterioResultado";
//import { PlanAuditoria } from "src/app/models/planauditoria";

@Injectable({
    providedIn: 'root',
})
export class PlanAuditoriaService implements IPlanAuditoriaService{
    private apiEndpoint: string;
    private apiRequisitoEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/auditoria';
        this.apiRequisitoEndpoint = environment.serviceEndpoint + '/requisito';
    }

    crear(): Auditoria {
        const programacion = new Auditoria();
        return programacion;
    }

    buscarPorParametros(parametros: {tipo?: string, estado?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.tipo) { params = params.set('tipo', parametros.tipo); }
        if (parametros.estado) { params = params.set('estado', parametros.estado); }
        return this.http.get(this.apiEndpoint, {params});
    }

    buscarPorCodigo(codigo: number) {

        
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }
    guardar(planauditoria: Auditoria) {
        let url = this.apiEndpoint;

        /*
        if (+planauditoria.idAuditoria !== 0) {
            url += `/${planauditoria.idAuditoria}`;
        }
        */
        return this.http.post(url, planauditoria);
    }

    actualizar(planauditoria: Auditoria) {
        let url = this.apiEndpoint+`/${planauditoria.idAuditoria}`;
        return this.http.post(url, planauditoria);
    }

    eliminar(programacion: Auditoria) {
        const url = `${this.apiEndpoint}/${programacion.idAuditoria}`;
        console.log(url);
        return this.http.delete(url);
    }

    buscarRequisitos(codigo: string){
        return this.http.get(this.apiEndpoint);
    }

    buscarConsideraciones(codigo:string){
        return this.http.get(this.apiEndpoint);
    }

    buscarAuditores(){
        return this.http.get(this.apiEndpoint);
    }

    buscarAuditoresPorParametros(parametros: {nroFicha?: string, apePaterno?: string, apeMaterno?: string, nombres?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.nroFicha) { params = params.set('nroFicha', parametros.nroFicha); }
        if (parametros.apePaterno) { params =  params.set('apePaterno', parametros.apePaterno); }
        if (parametros.apeMaterno) { params = params.set('apeMaterno', parametros.apeMaterno); }
        if (parametros.nombres) { params = params.set('nombres',parametros.nombres)}
        return this.http.get(this.apiEndpoint, {params});
    }

    obtenerEntidades(){
        let url = this.apiEndpoint + `/entidades`;
        return this.http.get(url);
    }

    buscarRequisitosNorma(codigo:string){
        let url = this.apiRequisitoEndpoint + `/obtener`;
        let params: HttpParams = new HttpParams()
                                    .set('idNorma',"1")
                                    .set('tipoNorma',"1");
        return this.http.get(url,{params});
    }

    buscarRequisitosAuditoria(codigo:string){
        let url = this.apiRequisitoEndpoint + `/obtenerRequisitosAuditoria`;
        let params: HttpParams = new HttpParams()
                                    .set('idAuditoria',codigo);
        return this.http.get(url,{params});
    }

    buscarCriterioResultado(){
        let url = this.apiEndpoint + `/criterios`;
        return this.http.get(url);
    }

    obtenerTipos(){
        let url = this.apiEndpoint + `/tipos`;
        return this.http.get(url);
    }

    obtenerDetectores(){
        let url = this.apiEndpoint + `/detectores`;
        return this.http.get(url);
    }

    obtenerEstados(){
        let url = this.apiEndpoint + `/estados`;
        return this.http.get(url);
    }

    obtenerAuditores(){
        let url = this.apiEndpoint + `/auditores`;
        return this.http.get(url);
    }

    obtenerObservadores(){
        let url = this.apiEndpoint + `/observadores`;
        return this.http.get(url);
    }

    buscarDatosAuditoriaCodigo(codigo:any){
        let url = this.apiEndpoint + `/${codigo}`;
        return this.http.get(url);
    }

    procesar(auditoria:Auditoria){
        console.log(auditoria.idAuditoria);
        let url = this.apiEndpoint;
        if (+auditoria.idAuditoria !== 0) {
            url += `/procesar`;
        }
        return this.http.post(url, auditoria);
    }

}