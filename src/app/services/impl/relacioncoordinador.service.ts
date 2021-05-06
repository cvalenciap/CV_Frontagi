import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { RelacionCoordinador } from  "src/app/models/relacioncoordinador";

@Injectable({
    providedIn: 'root',
})
export class RelacionCoordinadorService{
    
    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/relacioncoordinador';
    }

    obtenerArbolJerarquiaPorTipo(idTipo: number) {
        let url = `${this.apiEndpoint}/tipoJerarquia/${idTipo}`;
        return this.http.get(url);
    }

    obtenerRelacionCoordinador(parametros: { gerencia?: any; alcance?: any, colaborador?: any, sinAlcance?: any}, pagina: number, registros: number){
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
        if(parametros.gerencia){params = params.set('idGerencia', parametros.gerencia);}
        if(parametros.alcance){params = params.set('idAlcance', parametros.alcance);}
        if(parametros.colaborador){params = params.set('idCoordinador', parametros.colaborador);}
        if(parametros.sinAlcance){params = params.set('indicadorSinAlcance', parametros.sinAlcance);}
        return this.http.get(this.apiEndpoint, {params});
    }

    guardarRelacionCoordinador(relacionCoordinador:RelacionCoordinador){
        let url = this.apiEndpoint;
        return this.http.post(this.apiEndpoint, relacionCoordinador);
    }

    actualizarRelacionCoordinador(relacionCoordinador:RelacionCoordinador){
        let url = `${this.apiEndpoint}/${relacionCoordinador.idRelacion}`;
        return this.http.post(url, relacionCoordinador);
    }

    eliminarRelacionCoordinador(idRelacion: string) {
        let url = `${this.apiEndpoint}/${idRelacion}`;
        return this.http.delete(url);
    }

    obtenerDatosCoordinador(idGerencia: number, idAlcance: number){
        let url = this.apiEndpoint + `/datoscoordinador`;
        let parametros: HttpParams = new HttpParams()
        if(idGerencia != null){parametros = parametros.set('idGerencia', String(idGerencia));}
        if(idAlcance != null){parametros = parametros.set('idAlcance', String(idAlcance));}
        return this.http.get(url, {params: parametros});
    }

    obtenerJefeEquipo(nFicha: number){
        
        let url = `${this.apiEndpoint}/datosJefeEquipo/${nFicha}`;
        return this.http.get(url);
    }



}