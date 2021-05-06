import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Parametro} from '../../models';
import {Estado} from '../../models/enums';
import {IParametrosService} from '../interfaces/iparametros.service';
import {environment} from '../../../environments/environment';
import { ConstanteDetalle } from 'src/app/models/ConstanteDetalle';

@Injectable({
  providedIn: 'root',
})
export class ParametrosService implements IParametrosService {

  private apiEndpoint: string;
  private apiEndpointMant: string;
  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/constante';
    this.apiEndpointMant = environment.serviceEndpoint + '/parametro';
  }
  obtenerTipos(){
    let url = this.apiEndpoint + `/tipos`;
    return this.http.get(url);
  }
  crear(): Parametro {
    const parametro = new Parametro();
    parametro.codigo = 0;
    parametro.idconstante = 0;
    parametro.estado = Estado.ACTIVO;
    return parametro;
  }

//Listar Parametro(Constante)
  buscarPorParametros(parametros: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
  
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.idconstante) { params = params.set('idconstante', parametros.idconstante); }
    if (parametros.v_nomcons) { params = params.set('v_nomcons', parametros.v_nomcons); }
    if (parametros.n_discons) { params = params.set('n_discons', parametros.n_discons); }
    if (parametros.estadoConstante) { params = params.set('estadoConstante', parametros.estadoConstante); }
    return this.http.get(this.apiEndpoint, {params});
  }

  buscarPorParametrosMant(parametros: {idconstante?: string, n_discons?: string,v_padre?: string,
    v_nomcons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
    .set('pagina', pagina.toString())
    .set('registros', registros.toString());
    if (parametros.idconstante) { params = params.set('idconstante', parametros.idconstante); }
    if (parametros.v_padre) { params = params.set('v_padre', parametros.v_padre); }
    if (parametros.v_nomcons) { params = params.set('v_nomcons', parametros.v_nomcons); }
    if (parametros.v_descons) { params = params.set('v_descons', parametros.v_descons); }
    if (parametros.n_discons) { params = params.set('n_discons', parametros.n_discons); }
    return this.http.get(this.apiEndpointMant, {params});
  }

  buscarPorParametrosDetalle(parametros: {idconstantesuper?:string}, pagina: number, registros: number) {
    
    let params: HttpParams = new HttpParams()
    .set('pagina', pagina.toString())
    .set('registros', registros.toString());
    
    if (parametros.idconstantesuper) { params = params.set('idconstantesuper', parametros.idconstantesuper); }

    return this.http.get(this.apiEndpointMant, {params});
  }

  buscarPorCodigo(id: number) {
    const url = `${this.apiEndpoint}/${id}`;
    return this.http.get(url);
  }

  guardar( listaParametro: ConstanteDetalle[]) {
    
    let url = this.apiEndpointMant;
    const jsonParametro = JSON.stringify(listaParametro);
    let objetoRegistroParametro: any = {"listaParametro": jsonParametro};
    return this.http.post(url, objetoRegistroParametro);
  }

  guardarParametro(parametro: Parametro) {
    
    let url = this.apiEndpointMant;

    return this.http.post(url, parametro);
  }
//Eliminar Parametro o Constante
  eliminar(parametro: Parametro) {
    const url = `${this.apiEndpoint}/${parametro.idconstante}`;
    return this.http.delete(url);
  }

  obtenerParametroPadre(padre:string){

    let params: HttpParams = new HttpParams()
      .set('padre',padre)
      .set('pagina',"1")
      .set('registros',"1000");
    let url = environment.serviceEndpoint + '/constante';
    return this.http.get(url, {params});
  }

  obtenerIdParametro(lista:Parametro[], nombre:string):number {
		for(let objeto of lista) {
			if(objeto.v_valcons.toUpperCase()==nombre.toUpperCase()) {
				return objeto.idconstante;
			}
		}
		return 0;
  }

  obtenerValorParametro(lista:Parametro[], nombre:string):string {
		for(let objeto of lista) {
			if(objeto.v_descons.toUpperCase()==nombre.toUpperCase()) {
				return objeto.v_valcons;
			}
		}
		return "";
	}

}
