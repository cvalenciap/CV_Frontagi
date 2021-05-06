import { IBandejaReprogramacionService } from "../interfaces/ibandejareprogramacion.service";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Reprogramacion } from "src/app/models/reprogramacion";
import { Ejecucion } from  "src/app/models/ejecucion";

@Injectable({
    providedIn: 'root',
})
export class BandejaReprogramacionService implements IBandejaReprogramacionService{

    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/reprogramacion';
    }

    buscarReprogramacion(pagina: number, registros: number){
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        return this.http.get(this.apiEndpoint, {params});
    }

    buscarDetallePlanAccion(idNoConformidad: number, pagina: number, registros: number){
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        const url = `${this.apiEndpoint}/${idNoConformidad}`;
        return this.http.get(url, {params});
    }

    buscarDetalleEjecucion(idNoConformidad: number, pagina: number, registros: number){
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        const url = environment.serviceEndpoint +`/ejecucion/${idNoConformidad}`;
        return this.http.get(url, {params});
    }

    buscarAccionPropuesta(idNoConformidad: number){
        const url = environment.serviceEndpoint +`/accionPropuesta/${idNoConformidad}`;
        return this.http.get(url);
    }

    guardar(reprogramacion: Reprogramacion) {
        
        let url = this.apiEndpoint;
        if (reprogramacion.idPlanAccion !== 0) {
            url += `/${reprogramacion.idPlanAccion}`;
        }
        return this.http.post(url, reprogramacion);
    }
}