import {Observable} from 'rxjs';
import { FichaTecnica } from "src/app/models/fichaTecnica";

export interface IFichaTecnicaService {

    buscar(idfich: number): Observable<any>;
    
    guardar(archivo:any,fichaTecnica: FichaTecnica): Observable<any>;
    generarExcel(parametros: Map<string, any>): Observable<any>;
}