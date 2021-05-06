
import {Observable} from 'rxjs';
import { FichaAuditor } from 'src/app/models/fichaauditor';
import { BandejaRevisionAuditoria } from 'src/app/models/bandejarevisionauditoria';

export interface IBandejaRevisionAuditoriaService {
   

  crear(): BandejaRevisionAuditoria;  
  buscarPorCodigo(codigo: number): Observable<any>;
  obtenerTipos():Observable<any>;

      
  buscarPorBandejaRevisionAuditoria(
    bandejaRevisionAuditoria: {
    codigo?: string,  
    fecha?: string,
    descripcion?: string}, pagina: number, registros: number): Observable<any>;

  guardar(bandejaRevisionAuditoria: BandejaRevisionAuditoria): Observable<any>;

  eliminar(bandejaRevisionAuditoria: BandejaRevisionAuditoria): Observable<any>;
        

  
}



