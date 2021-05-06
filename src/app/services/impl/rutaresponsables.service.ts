import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RutaResponsable} from '../../models';
import {Estado} from '../../models/enums';
import {IRutaResponsablesService} from '../interfaces/irutaresponsables.service';
import {environment} from '../../../environments/environment';
import { RutaParticipante } from 'src/app/models/rutaParticipante';


@Injectable({
    providedIn: 'root',
})
export class RutaResponsablesService implements IRutaResponsablesService {

    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/ruta';
    }
    obtenerTipos(){
        let url = this.apiEndpoint + `/tipos`;
        return this.http.get(url);
    }
    crear(): RutaResponsable {
        const rutaresponsable = new RutaResponsable();
        rutaresponsable.codigo = 0;
        rutaresponsable.estado = Estado.ACTIVO;
        return rutaresponsable;
    }

    buscarPorParametros(parametros: {codigo?: string, estado?: string, descripcion?: string}, pagina: number, registros: number) {
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.codigo) { params = params.set('id', parametros.codigo); }
        if (parametros.estado!=null) { params =  params.set('estado', parametros.estado); }
        if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
        return this.http.get(this.apiEndpoint, {params});
    }

    buscarPorCodigo(codigo: number) {
        //const url = '${this.apiEndpoint}/${codigo}';
        //return this.http.get(url);
        let params: HttpParams = new HttpParams();
        params = params.set('id', codigo+"");
        return this.http.get(this.apiEndpoint, {params});
    }
    guardar(rutaresponsable: RutaResponsable) {
        console.log(rutaresponsable.codigo);
        let url = this.apiEndpoint;
        if (rutaresponsable.codigo !== 0) {
            url += `/${rutaresponsable.codigo}`;
        }
        return this.http.post(url, rutaresponsable);
    }

    eliminar(rutaresponsable: RutaResponsable) {
        const url = `${this.apiEndpoint}/${rutaresponsable.codigo}`;
        //console.log(url);
        //console.log(rutaresponsable.fechaRegistro);
        return this.http.delete(url);
    }

}

