
import {Observable} from 'rxjs';
import { BandejaRevisionInforme } from 'src/app/models/bandejarevisioninforme';

export interface IBandejaRevisionInformeService {
 

  crear(): BandejaRevisionInforme;  
  buscarPorCodigo(codigo: number): Observable<any>;
  obtenerTipos():Observable<any>;

      
  buscarPorBandejaRevisionInforme(
    bandejaRevisionInforme: {
    codigo?: string,  
    fecha?: string,
    descripcion?: string}, pagina: number, registros: number): Observable<any>;

  guardar(bandejaRevisionInforme: BandejaRevisionInforme): Observable<any>;

  eliminar(bandejaRevisionInforme: BandejaRevisionInforme): Observable<any>;
        

  
}



