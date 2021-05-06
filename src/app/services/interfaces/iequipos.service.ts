import {Observable} from 'rxjs';

export interface IEquiposService {

  buscarPorParametros(parametros: {id?: string, nombre?: string, jefe?: string, estado?: string},
    pagina: number, registros: number): Observable<any>;

}