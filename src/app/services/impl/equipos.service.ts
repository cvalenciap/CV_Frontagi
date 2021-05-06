import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { IEquiposService } from 'src/app/services/interfaces/iequipos.service';

@Injectable({
  providedIn: 'root',
})
export class EquiposService implements IEquiposService {

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/equipo';
  }
  
  buscarPorParametros(parametros: {id?:string, nombre?:string, jefe?:string, estado?:string}) {
    let params: HttpParams = new HttpParams()
    if (parametros.id) {      params = params.set('id',     parametros.id); }
    if (parametros.nombre) {  params = params.set('nombre', parametros.nombre); }
    if (parametros.jefe) {    params = params.set('funcion',parametros.jefe); }
    if (parametros.estado) {  params = params.set('estado', parametros.estado); }
    return this.http.get(this.apiEndpoint, {params});
  }

}