import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Response,RevisionDocumento} from '../../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import * as data from './participantes.json';
import * as dataDoc from './revisiondocumento.json';
import { IBandejaDocumentoService } from 'src/app/services/interfaces/ibandejadocumento.service';
import { Paginacion } from 'src/app/models/paginacion';
import { IDocumentoService } from 'src/app/services/interfaces/idocumento.service';

//lgomez
@Injectable({
  providedIn: 'root',
})
export class RevisionDocumentoMockService implements IDocumentoService{



  obtenerParticipantes():Observable<any>{
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaParticipantes;
    return Observable.of(response);
   }

   
   
     guardar(revisionDocumento: RevisionDocumento): Observable<any>{
       return null;
     }
   
     eliminar(id: String): Observable<any>{
      return null;
    }
   
     actualizar(revisionDocumento: RevisionDocumento): Observable<any>{
      return null;
    }
  
  listarRevisionDocumentos(indexIni, indexFin,registroXPagina) {
    const response = new Response();
    response.estado = 'OK';
    
    response.resultado = (<any>dataDoc).listabandejadocumento;
    response.paginacion = new Paginacion({pagina: 1, registros: registroXPagina, totalPaginas: null, totalRegistros: response.resultado.length });
    response.resultado = (<any>dataDoc).listabandejadocumento.slice(indexIni, indexFin);
    return Observable.of(response);
  }

  buscarPorCodigo(codigo: string) {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>dataDoc).listabandejadocumento.filter(objeto => { return objeto.codigo == codigo;});
    return Observable.of(response);
  }

  buscarPorParametros(parametros: any) {
    console.log("request param ", parametros);
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>dataDoc).listabandejadocumento.filter(objeto => { console.log("objeto a comparar ", objeto);if(objeto.solicitante == parametros.solicitante && objeto.estaSolicitud == parametros.estaSolicitud
    && objeto.fecSolicitud == parametros.fecSolicitud){return true;}else{ return false};});
    return Observable.of(response);
  }
  

}


