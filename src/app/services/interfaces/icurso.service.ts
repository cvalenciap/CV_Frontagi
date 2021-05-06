
import {Observable} from 'rxjs';
import { Curso } from 'src/app/models/curso';
export interface ICursoService {
//   crear(): Curso;
//   obtenerTipos():Observable<any>;
//   buscarPorParametros(parametros: {
//       codigo?: string,
//       nombre?: string,
//       descripcion?: string}, pagina: number, registros: number): Observable<any>;

//   buscarPorCodigo(codigo: number): Observable<any>;

  buscarCurso(parametros: {
    codigoCurso?: string,
    nombreCurso?: string},
    pagina: number, 
    registros?: number): Observable<any>;

  
 // guardar(aula: Encuesta): Observable<any>;

 // eliminar(aula: Encuesta): Observable<any>;
 registrarCurso(curso: Curso);
 actualizarDatosCurso(curso: Curso);
}