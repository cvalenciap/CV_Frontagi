//import { ProgramacionAuditoria } from "./../../models/programacionauditoria";
import { Observable } from "rxjs";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";
import { Programa } from "src/app/models/programa";
import { Auditoria } from "src/app/models/auditoria";

export interface IProgramacionAuditoriaService {
    crear(): Programa;
    obtenerTipos():Observable<any>;
    buscarPorParametros(parametros: {
      codigo?: string,
      fecha?: string,
      descripcion?: string}, pagina: number, registros: number): Observable<any>;
  
    buscarPorCodigo(codigo: number): Observable<any>;
  
    eliminar(programacion: Programa): Observable<any>;

    buscarDetalleProgramacion(codigo: number): Observable<any>;

    buscarDetalleProgramacionPorCodigo(codigo: number): Observable<any>;

    obtenerNormas():Observable<any>;

    obtenerMeses():Observable<any>;

    eliminarDetalle(auditoria: Auditoria): Observable<any>;

    obtenerEntidades():Observable<any>;
}