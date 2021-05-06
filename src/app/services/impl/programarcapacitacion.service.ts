import { IProgramarCapacitacionService } from "../interfaces/iprogramarcapacitacion.service";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ProgramarCapacitacion } from "src/app/models/programarcapacitacion";
//import { DetalleAsistencia } from "src/app/models/detalleasistencia";

@Injectable({
    providedIn: 'root',
})
export class ProgramarCapacitacionService implements IProgramarCapacitacionService{
    private apiEndpoint: string;
    
    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/programarcapacitacion';
    }
    /* **/
    crear(): ProgramarCapacitacion {
        const programarCapacitacion = new ProgramarCapacitacion();
        return programarCapacitacion;
    }
    /* */
    buscarCapacitacion(pagina: number, registros: number){
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
    return this.http.get(this.apiEndpoint);
    }

    /*buscarDetalleAsistencia(codigoCapacitacion: string){
        const url = `${this.apiEndpoint}/${codigoCapacitacion}`;
        return this.http.get(url);
    }*/
}