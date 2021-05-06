import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PreguntaCurso} from '../../models';
import {Estado} from '../../models/enums';

import {environment} from '../../../environments/environment';
import { IPreguntaCurso } from 'src/app/services/interfaces/ipreguntacurso.service';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
    providedIn: 'root',
  })

  export class PreguntaCursoService implements IPreguntaCurso {

    private apiEndpoint: string;
    private apiEndpointCurso: string;
    constructor(private http: HttpClient) {    
      this.apiEndpoint = environment.serviceEndpoint + '/pregunta';
      this.apiEndpointCurso = environment.serviceEndpoint + '/pregunta/curso';
     /*  this.apiEndpointMant = environment.serviceEndpoint + '/parametro'; */
    }
 /*    obtenerTipos(){    
      let url = this.apiEndpoint + `/tipos`;
      return this.http.get(url);
    } */

    buscarPorPregunta(preguntacurso: { codCurso?: string; nomCurso?: string; }, pagina: number, registros: number){
      let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
      if (preguntacurso.codCurso) { params = params.set('codCurso', preguntacurso.codCurso);}
      if (preguntacurso.nomCurso) { params = params.set('nomCurso', preguntacurso.nomCurso); }
      return this.http.get(this.apiEndpoint, {params});
  }
    
  obtenerTiposPregunta(){
    let url = this.apiEndpoint + `/tipoPregunta`;
    return this.http.get(url);
   
  }
  guardar(preguntacurso: PreguntaCurso): Observable<any> {
    let url = this.apiEndpoint+`/guardarPregunta`;
    if (preguntacurso.codPregunta !== null) {
      url += `/${preguntacurso.codPregunta}`;
    }
  return this.http.post(url, preguntacurso);
  }

  actualizar(preguntacurso: PreguntaCurso): Observable<any> {
    let url = this.apiEndpoint+`/actualizarPregunta`;
  return this.http.post(url, preguntacurso);
  }

  eliminar(preguntacurso: PreguntaCurso){
    const url = `${this.apiEndpoint}/${preguntacurso.codPregunta}`;
    return this.http.delete(url);
  }

  
  buscarPorCurso(preguntacurso: { codCurso?: string; nomCurso?: string; }, pagina: number, registros: number){
    let params: HttpParams = new HttpParams()
    .set('pagina', pagina.toString())
    .set('registros', registros.toString());
    if (preguntacurso.codCurso) { params = params.set('codCurso',preguntacurso.codCurso);}
    if (preguntacurso.nomCurso) { params = params.set('nomCurso',preguntacurso.nomCurso); }
    return this.http.get(this.apiEndpointCurso, {params});
}
  }