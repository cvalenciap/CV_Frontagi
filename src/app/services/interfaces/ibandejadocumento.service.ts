import {BandejaDocumento} from '../../models';
import {Observable} from 'rxjs';
import {Documento} from '../../models';


export interface IBandejaDocumentoService {

 // crear(): BandejaDocumento;
  obtenerTipos():Observable<any>;

  


  buscarPorParametrosArbol(parametros: {
    codigo?: string,
    fecha?: string,
    descripcion?: string}, pagina: number, registros: number): Observable<any>;

  buscarPorCodigo(codigo: number): Observable<any>;

  guardar(documento: Documento): Observable<any>;

  eliminar(bandejadocumento: BandejaDocumento): Observable<any>;

}