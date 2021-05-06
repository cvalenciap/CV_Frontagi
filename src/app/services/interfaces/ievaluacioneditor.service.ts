import {EvaluacionEditor} from 'src/app/models/evaluacioneditor';
import {Observable} from 'rxjs';

export interface IEvaluacionEditorService {


  crear(): EvaluacionEditor;
  buscarPorCodigo(codigo: string): Observable<any>;
  obtenerTipos():Observable<any>;
  buscarPorEvaluacionEditor(evaluacionEditor: {
    codigo?: string,
    fecha?: string,
    descripcion?: string}, pagina: number, registros: number): Observable<any>;

  guardar(evaluacionEditor: EvaluacionEditor): Observable<any>;

  eliminar(evaluacionEditor: EvaluacionEditor): Observable<any>;

  buscarDetalleEvaluacion(codigo: number): Observable<any>;

}



