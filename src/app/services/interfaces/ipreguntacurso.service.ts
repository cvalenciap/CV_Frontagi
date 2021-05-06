import {PreguntaCurso} from '../../models';
import {Observable} from 'rxjs';

export interface IPreguntaCurso{
    
    buscarPorPregunta(preguntacurso:{
        codCurso?:string,nomCurso?:string}, pagina: number, registros: number): Observable<any>;
    buscarPorCurso(preguntacurso:{
            codCurso?:string,nomCurso?:string}, pagina: number, registros: number): Observable<any>; 
    obtenerTiposPregunta():Observable<any>;
    guardar(preguntacurso: PreguntaCurso): Observable<any>;
    actualizar(preguntacurso: PreguntaCurso): Observable<any>;
    eliminar(preguntacurso: PreguntaCurso): Observable<any>; 
}