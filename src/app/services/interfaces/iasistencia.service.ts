import {Asistencia, EmpleadoAsistencia} from '../../models';
import {Observable} from 'rxjs';

export interface IAsistencia{
    buscarPorAsistencia(asistencia:{
        codCurso?:string,nomCurso?:string}, pagina: number, registros: number): Observable<any>;
    actualizar(asistencia: Asistencia): Observable<any>;
    crearDocumento(archivo:any,asistencia: Asistencia): Observable<any>;
}