import { NormaIncidencia } from '../../models/normaincidencia';
import { Observable } from 'rxjs';
import { Norma } from 'src/app/models/norma';

export interface INormaIncidenciaService {


  /* crear(): NormaIncidencia;
   buscarPorCodigo(codigo: number): Observable<any>;
   obtenerTipos():Observable<any>;
   
   buscarPorParametros(parametros: {
     tipo?: string,   
     norma?: string}, pagina: number, registros: number): Observable<any>;
 
    
   buscarPorNormaIncidencia(
     normaincidencia: {
     codigo?: string,
     fecha?: string,
     descripcion?: string}, pagina: number, registros: number): Observable<any>;
 
   guardar(normaincidencia: NormaIncidencia): Observable<any>;
 
   eliminar(normaincidencia: NormaIncidencia): Observable<any>;
   */
  listarNormasAuditoria(pagina: number, registros: number): Observable<any>;
  updateNormasAuditoria(norma: Norma);
}

