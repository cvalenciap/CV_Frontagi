import { Injectable } from "@angular/core";
import { IAgrupacionHallazgosService } from "../interfaces/iagrupacionhallazgos.service";
import { HttpParams, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class AgrupacionHallazgosService implements IAgrupacionHallazgosService{
    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/listaverificacion';
    }

    buscarPorParametros(parametros: {tipo?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.tipo) { params = params.set('tipo', parametros.tipo); }
        return this.http.get(this.apiEndpoint, {params});
    }

    obtenerTipoNoConformidad(){
        let url = this.apiEndpoint + `/tipoNoConformidad`;
        return this.http.get(url);
    }

    obtenerEquipos(){
        let url = this.apiEndpoint + `/equipos`;
        return this.http.get(url);
    }
}