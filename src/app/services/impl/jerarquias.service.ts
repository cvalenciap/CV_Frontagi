import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Jerarquia} from '../../models';
import {Estado} from '../../models/enums';
import {IJerarquiasService} from '../interfaces/ijerarquias.service';
import {environment} from '../../../environments/environment';
import { Paginacion } from 'src/app/models/paginacion';
import { Constante } from 'src/app/models/enums/constante';

@Injectable({
  providedIn: 'root',
})
export class JerarquiasService implements IJerarquiasService {

  private apiEndpoint: string;
  private apiEndpointJer: string;
  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/jerarquia';
    this.apiEndpointJer=environment.serviceEndpoint + '/jerarquiaIdPadre';
  }
  
  // obtenerTipos(){
  //   let params: HttpParams = new HttpParams()
  //     .set('padre',"Listado de Tipo de Jerarquia")
  //     .set('pagina',"1")
  //     .set('registros', "1000");
  //   let url = environment.serviceEndpoint + '/constante';
  //   return this.http.get(url, {params});
  // }

  obtenerTipos(paginacion: Paginacion, descripcion: string){
    let params: HttpParams = new HttpParams()
      .set('padre', Constante.TIPO_JERARQUIA ) //"Listado de Tipo de Jerarquia"
      .set('pagina', paginacion.pagina.toString())
      .set('registros', paginacion.registros.toString());
      if (descripcion) { params = params.set('descripcion', descripcion); }

    let url = environment.serviceEndpoint + '/constante';
    return this.http.get(url, {params});
  }
  
  crear(): Jerarquia {
    const jerarquia = new Jerarquia();
    jerarquia.id = 0;
    jerarquia.estado = Estado.ACTIVO;
    return jerarquia;
  }

  // buscarPorParametros(parametros: {codigo?: string, tipo?: string, descripcion?: string, nivel?: string, estado?: string},
  //   pagina: number, registros: number) {
  //   let params: HttpParams = new HttpParams()
  //     .set('pagina', pagina.toString())
  //     .set('registros', registros.toString());
  //   if (parametros.codigo) { params = params.set('id', parametros.codigo); }
  //   if (parametros.nivel) { params =  params.set('nivel', parametros.nivel); }
  //   if (parametros.tipo) { params =  params.set('tipo', parametros.tipo); }
  //   if (parametros.estado != null) { params =  params.set('estado', parametros.estado); }
  //   if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
  //   return this.http.get(this.apiEndpoint, {params});
  // }

  // buscarPorParametros(parametros: {descripcion?: string},
  //   pagina: number, registros: number) {
  //   let params: HttpParams = new HttpParams()
  //     .set('pagina', pagina.toString())
  //     .set('registros', registros.toString());
  //   if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }
  //   return this.http.get(this.apiEndpoint, {params});
  // }

  buscarPorCodigo(codigo: number) {
    //const url = '${this.apiEndpoint}/${codigo}';
    
    let params: HttpParams = new HttpParams();
    params = params.set('id', codigo+"");
    return this.http.get(this.apiEndpoint, {params});
  }


  buscarPorCodigoIdPadre(codigo: number) {
    //const url = '${this.apiEndpoint}/${codigo}';
    
    let params: HttpParams = new HttpParams();
    params = params.set('id', codigo+"");
    return this.http.get(this.apiEndpointJer, {params});
  }
  
  guardar(jerarquia: Jerarquia) {
    
    console.log(jerarquia.id);
    let url = this.apiEndpoint;
    // En caso sea actualizaci�n (Aun no implementada)
    if (jerarquia.id !== 0) {
      url += '/${jerarquia.id}';
    }
    return this.http.post(url, jerarquia);
  }

  actualizar(jerarquia: Jerarquia) {
    
    
    let url = this.apiEndpoint+ `/hijos/`+jerarquia.idPadre; 
    return this.http.post(url, jerarquia);
  }

  eliminar(jerarquia: Jerarquia) {
    const url = '${this.apiEndpoint}/${jerarquia.id}';
    console.log(url);
    console.log(jerarquia.fechaRegistro);
    return this.http.delete(url);
  }

  obtenerHijosJerarquia(parametros: {detAnterior?:string}) {
      
    let url=this.apiEndpoint+'/hijos';;
    let params: HttpParams = new HttpParams()
    if(parametros.detAnterior!=null) { params = params.set('detAnterior', parametros.detAnterior); }
    return this.http.get(url, {params});
  }
  obteneDocJerarquia(parametros: {ruta?:string,idTipo?:string}) {
    
  let url=this.apiEndpoint+'/doc';;
  let params: HttpParams = new HttpParams()
  if(parametros.ruta!=null) { params = params.set('ruta', parametros.ruta); }
  if(parametros.idTipo!=null) { params = params.set('idTipo', parametros.idTipo); }
  return this.http.get(url, {params});
}

obtenerJerarquiaTipoDocumento(parametros: { idTipoDocu?: string, id?: string }, pagina: number, registros: number) {
  let url = this.apiEndpoint + '/tipo-documento';
  let params: HttpParams = new HttpParams()
    .set('pagina', pagina.toString())
    .set('registros', registros.toString());

  if (parametros.idTipoDocu) { params = params.set('idTipoDocu', parametros.idTipoDocu); }
  if (parametros.id) { params = params.set('id', parametros.id); }

  return this.http.get(url, { params });
}

}