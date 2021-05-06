import { IBandejaAsistenciaService } from "../interfaces/ibandejaasistencia.service";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { DetalleAsistencia } from "src/app/models/detalleasistencia";
import { BandejaAsistencia } from "src/app/models/bandejaasistencia";

@Injectable({
    providedIn: 'root',
})
export class BandejaAsistenciaService implements IBandejaAsistenciaService{
    private apiEndpoint: string;
    
    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/bandejaasistencia';
    }
    /* **/
    crear(): BandejaAsistencia {
        const bandejaAsistencia = new BandejaAsistencia();
        return bandejaAsistencia;
    }
    /* */
    buscarAsistencia(pagina: number, registros: number){
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
    return this.http.get(this.apiEndpoint);
    }

    buscarDetalleAsistencia(codigoCapacitacion: string){
        const url = `${this.apiEndpoint}/${codigoCapacitacion}`;
        return this.http.get(url);
    }
}