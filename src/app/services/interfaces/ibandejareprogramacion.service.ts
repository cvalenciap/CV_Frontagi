import { Observable } from "rxjs";
import { Reprogramacion } from "src/app/models/reprogramacion";
import { Auditoria } from "src/app/models/auditoria";

export interface IBandejaReprogramacionService {

    buscarReprogramacion(pagina: number, registros: number): Observable<any>;

    buscarDetallePlanAccion(idDetallePlanAccion: number, pagina: number, registros: number): Observable<any>;
}