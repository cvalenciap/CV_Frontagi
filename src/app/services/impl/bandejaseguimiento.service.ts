import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
}) 

export class BandejaSeguimientoService{
    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/seguimientoDocumento';
    }

    obtenerSeguimiento(parametros:Map<string,any>){
        
        let parametrosHttp: HttpParams = new HttpParams();
    
        parametros.forEach((value, key) => {
        if (value) {
            parametrosHttp = parametrosHttp.set(key, value);
        }
        });
       
        return this.http.get(this.apiEndpoint, {params:parametrosHttp});
    }

    obtenerFlujoDocumento(idDocumento:number,idRevision:number,numIteracion:number){
        let params: HttpParams = new HttpParams()
        .set('idDocumento', idDocumento.toString())
        .set('id', idRevision.toString())
        .set('numeroIteracion', numIteracion.toString());

        const url = this.apiEndpoint + "/flujoDocumento";

        return this.http.get(url,{params})
    }

}
