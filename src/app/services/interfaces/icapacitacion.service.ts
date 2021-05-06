import { Observable } from "rxjs/internal/Observable";
import { ProgramarCapacitacion } from "src/app/models/programarcapacitacion";

export interface ICapacitacionService {

    buscarCapacitacion(parametros: {capacitacion?: string, instructor?: string}, pagina: number, registros?: number): Observable<any>;
    registrarCapacitacion(capacitacion: ProgramarCapacitacion);
}