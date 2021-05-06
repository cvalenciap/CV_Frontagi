import {RutaResponsable} from '../../models';
import {Observable} from 'rxjs';

export interface IRutaResponsablesService {

    crear(): RutaResponsable;
    obtenerTipos():Observable<any>;
    buscarPorParametros(parametros: {
        codigo?: string,
        estado?: string,
        descripcion?: string}, pagina: number, registros: number): Observable<any>;

    buscarPorCodigo(codigo: number): Observable<any>;

    guardar(rutaresponsable: RutaResponsable): Observable<any>;

    eliminar(rutaresponsable: RutaResponsable): Observable<any>;

}


