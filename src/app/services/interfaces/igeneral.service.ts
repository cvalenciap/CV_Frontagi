import { Parametro } from "src/app/models";
import { Observable } from "rxjs";

export interface IGeneralService {

    obtenerParametroPadre(padre:string): Observable<any>;

    obtenerIdParametro(lista:Parametro[], nombre:string):number;

    consultarTipoCurso(): Observable<any>;
}