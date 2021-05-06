import {RevisionDocumento} from '../../models';
import {Observable} from 'rxjs';

export interface IDocumentoService {


  buscarPorCodigo(codigo: string): Observable<any>;

  guardar(revisionDocumento: RevisionDocumento): Observable<any>;

  eliminar(id:string): Observable<any>;

  actualizar(revisionDocumento: RevisionDocumento): Observable<any>;
  //metodo opiconal no te va obligar a implementarlo
  //buscarPorCodigoDoc?:(codigo: string)=> Observable<any>;

}