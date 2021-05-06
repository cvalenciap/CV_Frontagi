import {DeteccionHallazgos} from '../../models/deteccionhallazgos';
import {Observable} from 'rxjs';
 
export interface IDeteccionHallazgosService {


  crear(): DeteccionHallazgos;
  buscarPorCodigo(codigo: number): Observable<any>;
  obtenerTipos():Observable<any>;
  obtenerOrigenDet():Observable<any>;
  obtenerDetector():Observable<any>;
  obtenerEstado():Observable<any>;


    buscarPorParametros(deteccionhallazgos: {
      tipo?: string,
      origenDet?: string,
      detector?: string,
      estado?: string,
      }, pagina: number, registros: number): Observable<any>;

   
  guardar(deteccionhallazgos: DeteccionHallazgos): Observable<any>;

  eliminar(deteccionhallazgos: DeteccionHallazgos): Observable<any>;
  
}



