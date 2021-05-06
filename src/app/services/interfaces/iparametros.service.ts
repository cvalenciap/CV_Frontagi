import {Parametro} from '../../models';
import {Observable} from 'rxjs';
import { ConstanteDetalle } from 'src/app/models/ConstanteDetalle';

export interface IParametrosService {

  crear(): Parametro;
  obtenerTipos():Observable<any>;
  buscarPorParametros(parametros: {
    codigo?: string,
    fecha?: string,
    descripcion?: string}, pagina: number, registros: number): Observable<any>;

  buscarPorParametrosMant(parametros: {idconstante?: string, n_discons?: string,v_padre?: string,
    v_nomcons?: string, v_descons?:string}, pagina: number, registros: number): Observable<any>;
    
  buscarPorCodigo(codigo: number): Observable<any>;

  guardar(listaParametro: ConstanteDetalle[]): Observable<any>;
    
  eliminar(parametro: Parametro): Observable<any>;

  obtenerParametroPadre(padre:string):Observable<any>;
  obtenerIdParametro(lista:Parametro[], nombre:string):number;

}
