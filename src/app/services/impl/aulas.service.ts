import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Aula} from '../../models';
import {Estado} from '../../models/enums';
import {IAulasService} from '../interfaces/iaulas.service';
import {environment} from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AulasService implements IAulasService {

    private apiEndpoint: string;
    private apiEndpointSede: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/aula';
        this.apiEndpointSede = environment.serviceEndpoint+ '/sede';
    }

    obtenerTipos(){
        let url = this.apiEndpoint + `/tipos`;
        return this.http.get(url);
    }
    crear(): Aula {
        const aula = new Aula();
        return aula;
    }

    buscarPorParametros(parametros: {ivcodaula?: string, ivnomaula?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.ivcodaula) { params = params.set('ivcodaula', parametros.ivcodaula); }
        if (parametros.ivnomaula) { params = params.set('ivnomaula', parametros.ivnomaula); }
        return this.http.get(this.apiEndpoint, {params}); 
    }

    buscarPorSede(parametros: {i_nidsede?: number}) {
        let params: HttpParams = new HttpParams();
        if (parametros.i_nidsede) { params = params.set('i_nidsede', parametros.i_nidsede.toString()); }
        return this.http.get(this.apiEndpointSede, {params}); 
    }

    buscarPorCodigo(codigo: number) {
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }
    
    guardar(aula: Aula): Observable<any> {
        let url = this.apiEndpoint;
        if (aula.nidaula !== 0) {
            url += `/${aula.nidaula}`;
          }
        return this.http.post(url, aula);
    }

    eliminar(aula: Aula) {
        const url = `${this.apiEndpoint}/${aula.nidaula}`;
        return this.http.delete(url);
    }
}
