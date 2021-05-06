import {Observable} from 'rxjs';
import {Correo} from 'src/app/models/correo';

export interface ICorreoService {

  obtenerCorreo(idDocumento, id, destinatario, tipoCorreo): Observable<any>;
  enviarCorreo(correo: Correo): Observable<any>;

}