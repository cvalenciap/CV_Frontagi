
import {Observable} from 'rxjs';
import { FichaAuditor } from 'src/app/models/fichaauditor';

export interface IFichaAuditorService {


  crear(): FichaAuditor;
  buscarPorCodigo(codigo: number): Observable<any>;
  obtenerTipos():Observable<any>;

    
  buscarPorFichaAuditor(
    fichaAuditor: {
    codigo?: string,
    fecha?: string,
    descripcion?: string}, pagina: number, registros: number): Observable<any>;

  guardar(fichaAuditor: FichaAuditor): Observable<any>;

  eliminar(fichaAuditor: FichaAuditor): Observable<any>;

}



