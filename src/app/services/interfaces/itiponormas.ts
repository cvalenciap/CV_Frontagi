import { Observable } from "rxjs";

export interface Itiponormas {
    obtenerTipoNormas(pagina: number, registros: number): Observable<any>;
}
