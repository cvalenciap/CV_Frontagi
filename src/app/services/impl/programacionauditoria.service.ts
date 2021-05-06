import { IProgramacionAuditoriaService } from "../interfaces/iprogramacionauditoria.service";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
//import { ProgramacionAuditoria } from "src/app/models/programacionauditoria";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";
import { Programa } from "src/app/models/programa";
import { Auditoria } from "src/app/models/auditoria";

@Injectable({
    providedIn: 'root',
})
export class ProgramacionAuditoriaService implements IProgramacionAuditoriaService{

    private apiEndpoint: string;
    private apiAuditoriaEndpoint:string;
    private apiNormaEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/programacion';
        this.apiAuditoriaEndpoint = environment.serviceEndpoint + '/auditoria';
        this.apiNormaEndpoint = environment.serviceEndpoint + '/norma';
    }
    obtenerTipos(){
        let url = this.apiEndpoint + `/tipos`;
        return this.http.get(url);
    }
    crear(): Programa {
        const programacion = new Programa();
        return programacion;
    }

    buscarPorParametros(parametros: {usuario?: string, fecha?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.usuario) { params = params.set('usuario', parametros.usuario); }
        if (parametros.fecha) { params =  params.set('fecha', parametros.fecha); }
        return this.http.get(this.apiEndpoint, {params});
    }

    buscarPorCodigo(codigo: number) {
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }
    registrar(programacion: Programa,listaAuditoria: Auditoria[]) {
        const jsonProgramacion = JSON.stringify(programacion);
        const jsonListaAuditorias = JSON.stringify(listaAuditoria);

        let objetoRegistroProgramacion:any = {"programacion": jsonProgramacion, "listaAuditorias": jsonListaAuditorias}
        console.log(objetoRegistroProgramacion);
        let url = this.apiEndpoint;
        /*
        if (programacion.idPrograma !== 0) {
            url += `/${programacion.idPrograma}`;
        }*/
        return this.http.post(url, objetoRegistroProgramacion);
    }

    modificar(programacion: Programa, listaAuditoriasEliminadas: Auditoria[], listaAuditoriasNuevas: Auditoria[]){
        const jsonProgramacion = JSON.stringify(programacion);
        const jsonListaAuditoriasEliminadas = JSON.stringify(listaAuditoriasEliminadas);
        const jsonListaAuditoriasNuevas = JSON.stringify(listaAuditoriasNuevas);

        let objetoModificacionProgramacion:any = {"programacion":jsonProgramacion, "listaAuditoriasEliminadas": jsonListaAuditoriasEliminadas, "listaAuditoriasNuevas":jsonListaAuditoriasNuevas};
        console.log(programacion);
        console.log(listaAuditoriasEliminadas);
        console.log(listaAuditoriasNuevas);
        console.log(objetoModificacionProgramacion);
        let url = this.apiEndpoint + `/${programacion.idPrograma}`;
        return this.http.post(url, objetoModificacionProgramacion);
    }

    eliminar(programacion: Programa) {
        
        const url = `${this.apiEndpoint}/${programacion.idPrograma}`;
        console.log(url);
        console.log(programacion.idPrograma);
        return this.http.delete(url);
    }

    buscarDetalleProgramacion(codigo: number){
        const url = this.apiAuditoriaEndpoint + `/listaAuditoriasPrograma/${codigo}`;
        return this.http.get(url);

    }

    buscarDetalleProgramacionPorCodigo(codigo: number) {
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }

    obtenerNormas(){
        let url = this.apiNormaEndpoint + `/obtenerLista?tipo=1`;
        return this.http.get(url);
    }

    obtenerMeses(){
        let url = this.apiEndpoint + `/meses`;
        return this.http.get(url);
    }

    eliminarDetalle(auditoria: Auditoria){
        const url = `${this.apiEndpoint}/${auditoria.idAuditoria}`;
        console.log(url);
        return this.http.delete(url);
    }

    obtenerEntidades(){
        let url = this.apiEndpoint + `/entidades`;
        return this.http.get(url);
    }
}