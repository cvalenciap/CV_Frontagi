import {Aula} from '../../models';
import {Observable} from 'rxjs';

export interface IAulasService {

    crear(): Aula;
    obtenerTipos():Observable<any>;
    buscarPorParametros(parametros: {
        ivcodaula?: string,
        ivnomaula?: string}, pagina: number, registros: number): Observable<any>;

    buscarPorCodigo(codigo: number): Observable<any>;

    guardar(aula: Aula): Observable<any>;

    eliminar(aula: Aula): Observable<any>; 

}

