import { Injectable } from "@angular/core";
import { IGeneralService } from "../interfaces/igeneral.service";
import { HttpParams, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Parametro } from "src/app/models";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class GeneralService implements IGeneralService{

    private apiEndpointConstante: string;
    private apiEndpointTrabajador: string;
    private apiEndpointTipoCurso: string;

    constructor(private http: HttpClient) {    
        this.apiEndpointConstante = environment.serviceEndpoint + '/constante';
        this.apiEndpointTrabajador = environment.serviceEndpoint + '/trabajador';
        this.apiEndpointTipoCurso = environment.serviceEndpoint + '/curso/tipo';
      }



    obtenerParametroPadre(padre:string):Observable<any>{
        let params: HttpParams = new HttpParams()
      .set('padre',padre)
      .set('pagina',"1")
      .set('registros',"1000");
    let url = environment.serviceEndpoint + '/constante';
    return this.http.get(url, {params});
    }

    obtenerIdParametro(lista:Parametro[], nombre:string):number{
        for(let objeto of lista) {
			if(objeto.v_valcons.toUpperCase()==nombre.toUpperCase()) {
				return objeto.idconstante;
			}
		}
		return 0;
    }

    agregarItem(listaResultados:any[],datosPaginacion:any):any[]{
      let  contador:number;
      contador = (datosPaginacion.pagina - 1)*datosPaginacion.registros + 1;
      listaResultados.forEach(element => {
       element.item = contador;
       contador++;
      });
   
      return listaResultados;
   
   }

   buscarTrabajadores(parametros: {nroFicha?: string, nombres?:string, apePaterno?:string, apeMaterno?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
    
    if (parametros.nroFicha) { params = params.set('nroFicha', parametros.nroFicha); }
    if (parametros.nombres) { params = params.set('nombres', parametros.nombres); }
    if (parametros.apePaterno) { params = params.set('apePaterno', parametros.apePaterno); }
    if (parametros.apeMaterno) { params = params.set('apeMaterno', parametros.apeMaterno); }
    return this.http.get(this.apiEndpointTrabajador, {params});
}

    consultarTipoCurso(): Observable<any>{
      let url = this.apiEndpointTipoCurso;
      return this.http.get(url);
    }
  }