import { Instructor } from '../../models';
import { Observable } from 'rxjs';

export interface IInstructoresService {

    crear(): Instructor;
    obtenerTipos(): Observable<any>;
    buscarPorParametros(instructor:Instructor, pagina: number, registros: number): Observable<any>;

    buscarPorCodigo(codigo: number): Observable<any>;

    guardar(instructor: Instructor): Observable<any>;

    eliminar(instructor: Instructor): Observable<any>;

}

