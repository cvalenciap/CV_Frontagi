import {DeteccionHallazgos} from '../../models/deteccionhallazgos';
import {Observable} from 'rxjs';
import { DetalleDeteccionHallazgos } from 'src/app/models/detalledeteccionhallazgos';
 
export interface IDetalleDeteccionHallazgosService {


  // crear(): DetalleDeteccionHallazgos;
  // buscarPorCodigo(codigo: number): Observable<any>;
  obtenerConstantes():Observable<any>;
  // buscarPorDetalleDeteccionHallazgos(deteccionhallasgos: {
  //   codigo?: string,
  //   fecha?: string,
  //   descripcion?: string}, pagina: number, registros: number): Observable<any>;

  // guardar(deteccionhallasgos: DetalleDeteccionHallazgos): Observable<any>;
  // eliminar(deteccionhallasgos: DetalleDeteccionHallazgos): Observable<any>;


       
}



