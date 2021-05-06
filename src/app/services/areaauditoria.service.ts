import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AreaAuditoria } from '../models/area-auditoria';
import { AreaAlcanceAuditoria } from '../models/areaalcance-auditoria';
import { AreaCargoAuditoria } from '../models/areacargo-auditoria';


@Injectable()
export class AreaAuditoriaService {
    constructor(private http: HttpClient, private api: ApiService) {
    }

    //Listar AreasParametros
    obtenerAreasParametros(): Observable<Response> {
        return this.http.get<Response>(this.api.getConsultaAreaParametro + '/listado');
    }

    guardarAreas(areaAuditoria: AreaAuditoria, lstAlcances: AreaAlcanceAuditoria[], lstCargos: AreaCargoAuditoria[]) {
        let params: HttpParams = new HttpParams;
        params = params.set('lstCargos', JSON.stringify(lstCargos));
        params = params.set('lstAlcances', JSON.stringify(lstAlcances));
        return this.http.post(this.api.getConsultaAreaParametro + '/guardarArea', areaAuditoria, { params });
    }

    eliminarArea(areaAuditoria: AreaAuditoria) {
        return this.http.post(this.api.getConsultaAreaParametro + '/eliminarArea', areaAuditoria);
    }

}