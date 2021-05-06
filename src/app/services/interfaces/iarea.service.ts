// YPM
import {NoConformidad} from '../../models/noconformidad';
import {Observable} from 'rxjs';
import { Paginacion } from 'src/app/models';

export interface IAreaService {

  buscarArea(parametros: {
    idArea?: string,
    idCentro?: string,
    descripcion?: string,
    tipoArea?: string,
    idAreaSuperior?: string}): Observable<any>;

  buscarAreaLista(parametros: {
      idArea?: string,
      idCentro?: string,
      descripcion?: string,
      tipoArea?: string,
      idAreaSuperior?: string,
      pagina?: string,
      registros?: string}): Observable<any>;
  
}