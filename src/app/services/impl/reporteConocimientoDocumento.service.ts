import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Http, ResponseContentType } from "@angular/http";

@Injectable({
    providedIn: 'root',
  })

export class ReporteConocimientoDocumentoService{

    private apiEndpoint: string;

    constructor(private httpClient: HttpClient){
        this.apiEndpoint = environment.serviceEndpoint + '/reporteConocimientoDocumento';
    }
    
    obtenerConocimientoDocumento(parametros:Map<string,any>){
        let parametrosHttp: HttpParams = new HttpParams();
    
        parametros.forEach((value, key) => {
        if (value) {
            parametrosHttp = parametrosHttp.set(key, value);
        }
        });
       
        return this.httpClient.get(this.apiEndpoint, {params:parametrosHttp});
    }

    obtenerReporteNoConocimientoDocumento(idDocumento:number,codigo:string, descripcion:string,idRevision:number){
        let url = this.apiEndpoint + "/generarReporte?idDocumento="+idDocumento + "&codigoDoc="+codigo + "&titulo="+descripcion + "&id="+idRevision + "&estCono=1";
        return this.httpClient.get(url, {responseType:'blob'});
    }

    obtenerReporteConocimientoDocumento(idDocumento:number,codigo:string, descripcion:string,idRevision:number){
        let url = this.apiEndpoint + "/generarReporte?idDocumento="+idDocumento + "&codigoDoc="+codigo + "&titulo="+descripcion + "&id="+idRevision + "&estCono=0";
        return this.httpClient.get(url, {responseType:'blob'});
    }
}