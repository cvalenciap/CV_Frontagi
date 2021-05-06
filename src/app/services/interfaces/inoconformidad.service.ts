// YPM
import {NoConformidad} from '../../models/noconformidad';
import {Observable} from 'rxjs';
import { Paginacion } from 'src/app/models';

export interface INoConformidadService {

  buscarNoConformidad(parametros: {
    tipoFecha?: string,
    fechaDesde?: string,
    fechaHasta?: string,
    codigo?: string,
    tipoConformidad?: string,
    norma?: string,
    alcance?: string,
    requisito?: string,
    origenDeteccion?: string,
    gerencia?: string,
    equipo?: string}, paginacion: Paginacion): Observable<any>;  

  buscarNoConformidadSeguimiento(codigo: string,pagina:number,registros:number): Observable<any>;

}
