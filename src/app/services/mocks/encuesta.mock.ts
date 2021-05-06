import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response} from '../../models';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
//import {IEncuestaService} from '../interfaces/iencuesta.service';
import * as data from './encuesta.json';
import { Encuesta } from 'src/app/models/encuesta';

@Injectable({
    providedIn: 'root',
})
export class EncuestaMockService {

   /*  crear(): Encuesta {
        const encuesta = new Encuesta();
        //encuesta.ndisencu = Estado.ACTIVO;
        return encuesta;
    }

    obtenerTipos() {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaEncuestas;
        return Observable.of(response);
    }

    buscarPorParametros(parametros: {inidcurs?: number, inidencu?: number, ivcodencu?: string, ivnomencu?: string} ){
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaEncuestas;
        return Observable.of(response); 
    } 



    buscarPorCodigo(codigo: number) {
        const response = new Response(); 
        response.estado = 'OK';
        response.resultado = (<any>data).listaEncuestas[codigo - 1];
        return Observable.of(response);
    }

    guardar(aula: Encuesta) {
        const response = new Response();
        response.estado = 'OK';
        response.resultado = (<any>data).listaEncuestas[0];
        return Observable.of(response);
    }

    eliminar(aula: Encuesta) {
        const response = new Response();
        response.estado = 'OK';
        return Observable.of(response);
    }*/

}

