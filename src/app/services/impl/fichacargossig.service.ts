
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CargosSig } from "src/app/models";
import { IFichaCargosSigService } from "../interfaces/ifichacargossig.service";

//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";

@Injectable({
    providedIn: 'root',
})
export class FichaCargoSigService implements IFichaCargosSigService{

    private apiEndpoint: string;
    private apiEndpointFicha: string;
    private apiEndpointUpdateCarga: string;
    private apiEndpointCargaCursos: string;

    constructor(private http: HttpClient) {
        this.apiEndpointFicha = environment.serviceEndpoint  + '/registro-cargo-auditoria'
        this.apiEndpoint = environment.serviceEndpoint + '/registro-cargo-auditoria/lista-bandeja';
        this.apiEndpointUpdateCarga= environment.serviceEndpoint + '/registro-cargo-auditoria/carga-auditor';
    }
    crear(): CargosSig {
        const ficha = new CargosSig('','','');
        return ficha;
    }
    buscarPorParametros(parametros: {avanzada?: string, nombre?: string, sigla?: string, colaborador?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('nPagina', pagina.toString())
            .set('nRegistro', registros.toString())
            .set('nombre', parametros.nombre)
            .set('sigla', parametros.sigla)
            .set('colaborador', parametros.colaborador)
            .set('avanzada', parametros.avanzada)
            
            console.log(params);   
        return this.http.get(this.apiEndpoint, {params});


     }
 
    obtenerDatosPrincipalesAuditor(codigo: number) {
        let params: HttpParams = new HttpParams()            
            .set('codAuditor', codigo.toString());
     
        return this.http.get(this.apiEndpointUpdateCarga, {params});
    }



    guardar(ficha: CargosSig) {
        console.log(ficha.sigla);
        let url = this.apiEndpoint;
        //if (ficha.codigo === "") {
            url += `/${ficha.sigla}`;
        //}
        return this.http.post(url, ficha);
        
    }

    eliminar(ficha: CargosSig) {
        const url = `${this.apiEndpoint}/${ficha.sigla}`;
      //  console.log(ficha);
       // console.log(url);
        console.log(ficha.sigla+'serviciooooooo');   
        return this.http.delete(url);
    }    

    buscarAuditores(parametros: {nombre?: string, sigla?: string, colaborador?: string
    }, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.nombre) { params =  params.set('nombre', parametros.nombre); }
        if (parametros.sigla) { params =  params.set('sigla', parametros.sigla); }
        if (parametros.colaborador) { params =  params.set('colaborador', parametros.colaborador); }

        return this.http.get(this.apiEndpointFicha, {params});

    }
    
}