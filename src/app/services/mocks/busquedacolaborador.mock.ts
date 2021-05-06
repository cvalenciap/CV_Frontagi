import { Injectable } from "@angular/core";
import { Response } from './../../models/response';
import { Observable } from "rxjs";
import * as data from "./listacolaboradores.json";

@Injectable({
    providedIn: 'root',
})
export class BusquedaColaboradorMockService{
    buscarColaboradoresPorParametros(parametros: {nroFicha?: string, apePaterno?: string, apeMaterno?: string, nombres?: string, rol?: string}, pagina: number, registros: number) {
        const response = new Response();
        response.estado = 'OK';
        let lista:any[] = (<any>data).listaBusquedaColaboradores;
        response.resultado = lista;
        return Observable.of(response);
    }
}