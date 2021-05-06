import { IListaVerificacionService } from "../interfaces/ilistaverificacion.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ListaVerificacionAuditor } from "src/app/models/listaverificacionauditor";

@Injectable({
    providedIn: 'root',
})
export class ListaVerificacionService implements IListaVerificacionService{
    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/listaVerificacion';
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

    obtenerRequisitosAuditoria(codigo:number){
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }

    obtenerDatosRequisitos(codigo:string){
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }

    actualizarListaVerificacion(item:ListaVerificacionAuditor){
        const url = `${this.apiEndpoint}/${item.idListaVerificacion}`;

        return this.http.post(url,item);
    }

    aprobarListaVerificacion(item:ListaVerificacionAuditor){
        const url = `${this.apiEndpoint}/aprobar/${item.idListaVerificacion}`;
        return this.http.post(url,item);
    }

    rechazarListaVerificacion(item:ListaVerificacionAuditor){
        const url = `${this.apiEndpoint}/rechazar/${item.idListaVerificacion}`;
        return this.http.post(url,item);
    }

    
}