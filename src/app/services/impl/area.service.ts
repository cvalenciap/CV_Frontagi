import { Directive, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Estado } from '../../models/enums';
import { IAreaService } from '../interfaces/iarea.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Paginacion } from 'src/app/models';

@Injectable({
    providedIn: 'root',
  })
  export class AreaService implements IAreaService {

    private apiEndpoint: string;
    private apiEndpointEquipoMigracion: string;

    constructor(private http: HttpClient) {
      this.apiEndpoint = environment.serviceEndpoint + '/area';
      this.apiEndpointEquipoMigracion = environment.serviceEndpoint + '/migracion/area';
    }


    buscarArea(parametros: { idArea?: string; idCentro?: string; descripcion?: string; abreviatura?: string; tipoArea?: string; idAreaSuperior?: string; }) {
      let params: HttpParams = new HttpParams().set('pagina', '1').set('registros', '1000');
      if (parametros.idArea) {params = params.set('idArea', parametros.idArea); }
      if (parametros.idCentro) {params = params.set('idCentro', parametros.idCentro); }
      if (parametros.descripcion) {params = params.set('descripcion', parametros.descripcion); }
      if (parametros.abreviatura) { params = params.set('abreviatura', parametros.abreviatura); }
      if (parametros.tipoArea) {params = params.set('tipoArea', parametros.tipoArea); }
      if (parametros.idAreaSuperior) {params = params.set('idAreaSuperior', parametros.idAreaSuperior); }
      return this.http.get(this.apiEndpoint, { params });
    }

    buscarAreaLista(parametros: {idArea?: string; idCentro?: string; descripcion?: string; abreviatura?: string;
                                 tipoArea?: string; idAreaSuperior?: string; pagina?: string;
                                 registros?: string}) {

      let params: HttpParams = new HttpParams()
      .set('pagina', parametros.pagina)
      .set('registros', parametros.registros);
                                  
      if (parametros.idArea) {params = params.set('idArea', parametros.idArea); }
      if (parametros.idCentro) {params = params.set('idCentro', parametros.idCentro); }
      if (parametros.descripcion) {params = params.set('descripcion', parametros.descripcion); }
      if (parametros.abreviatura) { params = params.set('abreviatura', parametros.abreviatura); }
      if (parametros.tipoArea) {params = params.set('tipoArea', parametros.tipoArea); }
      if (parametros.idAreaSuperior) {params = params.set('idAreaSuperior', parametros.idAreaSuperior); }

      return this.http.get(this.apiEndpoint, { params });
    }

  buscarAreaListaMigracion(parametros: {idArea?: string; idCentro?: string; descripcion?: string; abreviatura?: string;
    tipoArea?: string; idAreaSuperior?: string; pagina?: string;
    registros?: string}) {

    let params: HttpParams = new HttpParams()
      .set('pagina', parametros.pagina)
      .set('registros', parametros.registros);

    if (parametros.idArea) {params = params.set('idArea', parametros.idArea); }
    if (parametros.idCentro) {params = params.set('idCentro', parametros.idCentro); }
    if (parametros.descripcion) {params = params.set('descripcion', parametros.descripcion); }
    if (parametros.abreviatura) { params = params.set('abreviatura', parametros.abreviatura); }
    if (parametros.tipoArea) {params = params.set('tipoArea', parametros.tipoArea); }
    if (parametros.idAreaSuperior) {params = params.set('idAreaSuperior', parametros.idAreaSuperior); }

    return this.http.get(this.apiEndpointEquipoMigracion, { params });
  }

  }
