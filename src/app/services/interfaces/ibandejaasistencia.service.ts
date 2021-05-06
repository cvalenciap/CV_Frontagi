import { Observable } from "rxjs";
import { BandejaAsistencia } from "src/app/models/bandejaasistencia";

export interface IBandejaAsistenciaService {

    buscarAsistencia(pagina: number, registros: number): Observable<any>;

    buscarDetalleAsistencia(codigoCapacitacion: string): Observable<any>;
}