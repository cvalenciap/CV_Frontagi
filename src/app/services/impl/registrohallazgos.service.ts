import { IRegistroHallazgosService } from "../interfaces/iregistrohallazgos.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { ListaVerificacionAuditor } from "src/app/models/listaverificacionauditor";

@Injectable({
    providedIn: 'root',
})
export class RegistroHallazgosService implements IRegistroHallazgosService{
    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/revisionHallazgos';
    }

    buscarPorParametros(parametros: {estado?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.estado) { params = params.set('estado', parametros.estado); }
        return this.http.get(this.apiEndpoint, {params});
    }

    buscarPorCodigo(codigo:string){
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }

    obtenerEstados(){
        let url = this.apiEndpoint + `/estados`;
        return this.http.get(url);
    }

    obtenerAuditoresHallazgo(codigo){
        let url = this.apiEndpoint + `/auditores`;
        return this.http.get(url);
    }

    obtenerRequisitosAuditoria(codigo:string){
        let url = this.apiEndpoint + `/requisitos`;
        return this.http.get(url);
    }

    obtenerDatosRequisitos(codigo:string){
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }

    obtenerCriterios(codigo:String){
        const url = `${this.apiEndpoint}/criterios/${codigo}`;
        return this.http.get(url);
    }

    actualizarRevisionHallazgos(item:ListaVerificacionAuditor){
        const url = `${this.apiEndpoint}/${item.idListaVerificacion}`;
        return this.http.post(url,item);
    }

    aprobarRevisionHallazgos(item:ListaVerificacionAuditor){
        const url = `${this.apiEndpoint}/aprobar/${item.idListaVerificacion}`;
        return this.http.post(url,item);
    }

    rechazarRevisionHallazgos(item:ListaVerificacionAuditor){
        const url = `${this.apiEndpoint}/rechazar/${item.idListaVerificacion}`;
        return this.http.post(url,item);
    }
}