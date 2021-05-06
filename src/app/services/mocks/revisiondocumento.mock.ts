import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response, BandejaDocumento} from '../../models';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import * as data from './participantes.json';
//lgomez
@Injectable({
  providedIn: 'root',
})
export class RevisionDocumentoMockService {


  obtenerParticipantes():Observable<any>{
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaParticipantes;
    return Observable.of(response);
   }
  

}


