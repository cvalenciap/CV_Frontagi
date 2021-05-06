import {Observable} from 'rxjs';

export interface IColaboradoresService {

  buscarPorParametros(parametros: {
    id?: string, equipo?: string, funcion?: string, responsable?: string, estado?: string},
    pagina: number, registros: number): Observable<any>;


  buscarColaborador(parametros: {idDocumento?: string, equipo?: string, funcion?: string, nombres?: string,apePaterno?: string,apeMaterno?: string, estado?: string},
    pagina: number, registros: number): Observable<any>;

}