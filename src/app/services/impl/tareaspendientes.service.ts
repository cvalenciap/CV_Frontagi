import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TareasPendientesService {
    private apiEndPoint: string;

    constructor(private http: HttpClient) {
        this.apiEndPoint = environment.serviceEndpoint;
    }

    obtenerTareasPendientesDocumental(idColaborador){
        let url = this.apiEndPoint + `/tareaspendientesdocu/${idColaborador}`;
        return this.http.get(url);
    }

    obtenerTareasPendientesAuditoria(idColaborador){
        let url = this.apiEndPoint + `/tareaspendientesaudi/${idColaborador}`;
        return this.http.get(url);
    }

    obtenerTareasPendientesNoConformidades(idColaborador){
        let url = this.apiEndPoint + `/tareaspendientesnoconf/${idColaborador}`;
        return this.http.get(url);
    }

    obtenerDashBoardDocumento(anio, idTrimestre){
        let url = this.apiEndPoint + `/dashboardDocumento/${anio}/${idTrimestre}`;
        return this.http.get(url);
    }

    obtenerDashBoardExcel(anio, idTrimestre, trimestre){
        let url = this.apiEndPoint + `/dashboardExcel/${anio}/${idTrimestre}/${trimestre}`;
        return this.http.get(url, {responseType: 'arraybuffer'});
    }

}