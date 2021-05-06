import {Jerarquia} from '../../models';
import {Observable} from 'rxjs';
import { Paginacion } from 'src/app/models/paginacion';

export interface IJerarquiasService {

  crear(): Jerarquia;
  
  obtenerTipos(paginacion: Paginacion, descripcion: string):Observable<any>;

  // buscarPorParametros(parametros: {
  //   codigo?: string, tipo?: string, descripcion?: string, nivel?: string, estado?: string},
  //   pagina: number, registros: number): Observable<any>;

  buscarPorCodigo(codigo: number): Observable<any>;

  guardar(jerarquia: Jerarquia): Observable<any>;

  eliminar(jerarquia: Jerarquia): Observable<any>;

}
