import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Response, BandejaDocumento} from '../../../models';
import {Estado} from '../../../models/enums';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {IBandejaDocumentoService} from '../../interfaces/ibandejadocumento.service';
import * as data from './tareaspendientes.json';

@Injectable({
  providedIn: 'root',
})
export class TareasPendientesMockService {

 

  obtenerConocimientoRevision() {
    const response = new Response();
    response.estado = 'OK';
    response.resultado = (<any>data).listaTareasPendientes;
    return Observable.of(response);
  }

  


}


