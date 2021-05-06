import { Observable } from "rxjs";
import { BandejaEvaluaciones } from "src/app/models/bandejaevaluaciones";
import {Asistencia, EmpleadoAsistencia} from '../../models';
export interface IBandejaEvaluacionesService {

    buscarEvaluaciones(pagina: number, registros: number): Observable<any>;

    buscarDetalleEvaluaciones(codigoCapacitacion: string): Observable<any>;

    buscarPorEvaluacion(asistencia:{
        codCurso?:string,nomCurso?:string}, pagina: number, registros: number): Observable<any>;

    actualizar(asistencia: Asistencia): Observable<any>;
    buscarEmpleado(empleado:{
        idCapacitacion?:string}, pagina: number, registros: number): Observable<any>;
}