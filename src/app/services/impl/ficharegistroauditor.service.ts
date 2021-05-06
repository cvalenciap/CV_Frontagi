
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { RegistroAuditor } from "src/app/models/registroAuditor";
import { IFichaRegistroAuditorService } from "../interfaces/ificharegistroauditor.service";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";

@Injectable({
    providedIn: 'root',
})
export class FichaRegistroAuditorService implements IFichaRegistroAuditorService{

    private apiEndpoint: string;
    private apiEndpointFicha: string;
    private apiEndpointUpdateCarga: string;
    private apiEndpointCargaCursos: string;

    constructor(private http: HttpClient) {
        this.apiEndpointFicha = environment.serviceEndpoint  + '/ficha-auditor'
        this.apiEndpoint = environment.serviceEndpoint + '/ficha-auditor/lista-bandeja';
        this.apiEndpointUpdateCarga= environment.serviceEndpoint + '/ficha-auditor/carga-auditor';
        this.apiEndpointCargaCursos= environment.serviceEndpoint + '/ficha-auditor/carga-cursos-obligatorios';
    }
  /*  obtenerTipos(){
        let url = this.apiEndpoint + `/lista-bandeja`;
        return this.http.get(url);
    }*/
    crear(): RegistroAuditor {
        const ficha = new RegistroAuditor('','','','',0,'',0,'');
        return ficha;
    }
    obtenerCursosAuditor(itemCodigo?:number, obligatorio?: number){
        let params: HttpParams = new HttpParams()
        .set('codigo', itemCodigo.toString())
        .set('obligatorio', obligatorio.toString())

        return this.http.get(this.apiEndpointCargaCursos+"/", {params});   
    }
    buscarPorParametros(parametros: {avanzada?: string, numFicha?: string, nombreAuditor?: string, apePaternoAuditor?: string, apeMaternoAuditor?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('nPagina', pagina.toString())
            .set('nRegistro', registros.toString())
            .set('numFicha', parametros.numFicha)
            .set('nombreAuditor', parametros.nombreAuditor)
            .set('apePaternoAuditor', parametros.apePaternoAuditor)
            .set('apeMaternoAuditor', parametros.apeMaternoAuditor)
            .set('avanzada', parametros.avanzada)
            
            console.log(params);   
        return this.http.get(this.apiEndpoint, {params});


     }
 
    obtenerDatosPrincipalesAuditor(codigo: number) {
        let params: HttpParams = new HttpParams()            
            .set('codAuditor', codigo.toString());
     
        return this.http.get(this.apiEndpointUpdateCarga, {params});
    }



    guardar(ficha: RegistroAuditor) {
        console.log(ficha.numFicha);
        let url = this.apiEndpoint;
        if (ficha.numFicha === "") {
            url += `/${ficha.numFicha}`;
        }
        return this.http.post(url, ficha);
        
    }

    eliminar(ficha: RegistroAuditor) {
        const url = `${this.apiEndpoint}/${ficha.numFicha}`;
      //  console.log(ficha);
       // console.log(url);
        console.log(ficha.numFicha+'serviciooooooo');   
        return this.http.delete(url);
    }    

    buscarAuditores(parametros: {nroFicha?: string, nombres?: string, apePaterno?: string, apeMaterno?: string,idRol?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.nroFicha) { params = params.set('nroFicha', parametros.nroFicha); }
        if (parametros.nombres) { params =  params.set('nombres', parametros.nombres); }
        if (parametros.apePaterno) { params =  params.set('apePaterno', parametros.apePaterno); }
        if (parametros.apeMaterno) { params =  params.set('apeMaterno', parametros.apeMaterno); }
        if (parametros.idRol) { params =  params.set('idRol', parametros.idRol); }

        return this.http.get(this.apiEndpointFicha, {params});

    }
    
}