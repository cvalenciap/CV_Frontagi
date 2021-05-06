import { IEncuestaService } from "../interfaces/iencuesta.service";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
//import { ProgramacionAuditoria } from "src/app/models/programacionauditoria";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";
import { Encuesta } from "src/app/models/encuesta";
import { Auditoria } from "src/app/models/auditoria";
import {Estado} from '../../models/enums';
import { DetalleEncuesta } from "src/app/models/detalle-encuesta";
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class EncuestaService implements IEncuestaService{

    private apiEndpoint: string;
    private apiEndpointDet: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/encuesta';
        this.apiEndpointDet = environment.serviceEndpoint + '/detencuesta';
    }
    obtenerTipos(){
        let url = this.apiEndpoint + `/tipos`;
        return this.http.get(url);
    }
    crear(): Encuesta {
        const encuesta = new Encuesta();
        return encuesta;
    }

    buscarPorParametros(encuesta:Encuesta, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (encuesta.nidcurs) { params = params.set('inidcurs', encuesta.nidcurs.toString()); }
        if (encuesta.nidencu) { params =  params.set('inidencu', encuesta.nidencu.toString()); }
        if (encuesta.vcodencu) { params = params.set('ivcodencu', encuesta.vcodencu); }
        if (encuesta.vnomencu) { params = params.set('ivnomencu', encuesta.vnomencu); }
        return this.http.get(this.apiEndpoint, {params});
    }

    buscarPorParametrosDet(parametros: {inidencu?: number}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.inidencu) { params = params.set('inidencu', parametros.inidencu.toString()); }
        return this.http.get(this.apiEndpointDet, {params});
    }

    buscarPorCodigo(codigo: number) {
        const url = `${this.apiEndpoint}/detalle/${codigo}`;
        return this.http.get(url);
    }

    guardar(encuesta: Encuesta) : Observable<any>{
        
        let url = this.apiEndpoint;
        if (encuesta.nidencu !== 0) {
            url += `/${encuesta.nidencu}`;
        }
        return this.http.post(url, encuesta);
    }

    guardarDet(detalleEncuesta: DetalleEncuesta): Observable<any> {
        
        let url = this.apiEndpointDet;
        if (detalleEncuesta.niddetaencu !== 0) {
            url += `/${detalleEncuesta.niddetaencu}`;
        }
        return this.http.post(url, detalleEncuesta);
    }

   eliminar(encuesta: Encuesta) {
        const url = `${this.apiEndpoint}/${encuesta.nidencu}`;
        return this.http.delete(url);
    }

    eliminarDet(detalleEncuesta: DetalleEncuesta) {
        const url = `${this.apiEndpoint}/detalle/${detalleEncuesta.niddetaencu}`;
        return this.http.delete(url);
    }

    buscarDetalleProgramacion(codigo: number){

        return this.http.get(this.apiEndpoint);
    }

    buscarDetalleProgramacionPorCodigo(codigo: number) {
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }

    obtenerNormas(){
        let url = this.apiEndpoint + `/normas`;
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