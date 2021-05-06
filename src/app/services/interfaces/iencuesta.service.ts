//import {Encuesta} from '../../models';
import {Observable} from 'rxjs';
import { Encuesta } from 'src/app/models/encuesta';
export interface IEncuestaService {
  crear(): Encuesta;
  obtenerTipos():Observable<any>;
  buscarPorParametros(encuesta:Encuesta, pagina: number, registros: number): Observable<any>;

  buscarPorCodigo(codigo: number): Observable<any>;

 // guardar(aula: Encuesta): Observable<any>;

 // eliminar(aula: Encuesta): Observable<any>;
}