import { Observable } from "rxjs";
import { ProgramarCapacitacion } from "src/app/models/programarcapacitacion";

export interface IProgramarCapacitacionService {

    buscarCapacitacion(pagina: number, registros: number): Observable<any>;

    //buscarDetalleEvaluaciones(codigo: string): Observable<any>;
}