import { Observable } from "rxjs";

export interface InormaRequisitos {
    obtenerNormaRequisitos(pagina: number, registros: number): Observable<any>;
}
