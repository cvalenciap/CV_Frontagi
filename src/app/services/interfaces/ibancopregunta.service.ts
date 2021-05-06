import { Pregunta } from "./../../models/pregunta";
import { Observable } from "rxjs";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";

export interface IBancoPreguntaService {
    crear(): Pregunta;

   // obtenerListaPregunta(variable: String):Observable<any>;

    guardar(programacion: Pregunta): Observable<any>;

}