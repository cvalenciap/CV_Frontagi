//import { PlanAuditoria } from "src/app/models/planauditoria";
import { Observable } from "rxjs";
import { Auditoria } from "src/app/models/auditoria";
import { CriterioResultado } from "src/app/models/criterioResultado";
import { ConsideracionPlan } from "src/app/models/consideracionesplan";

export interface IPlanAuditoriaService{
    crear(): Auditoria;
    buscarPorParametros(parametros: {
        tipo?: string, 
        detector?: string, 
        estado?: string}, pagina: number, registros: number): Observable<any>;

    buscarPorCodigo(codigo: number): Observable<any>;

    guardar(planauditoria: Auditoria): Observable<any>;

    eliminar(planauditoria: Auditoria): Observable<any>;

    buscarRequisitos(codigo: string): Observable<any>;

    buscarConsideraciones(codigo:string): Observable<any>;

    buscarAuditores(): Observable<any>;

    buscarAuditoresPorParametros(parametros: {
        nroFicha?: string,
        apePaterno?: string,
        apeMaterno?: string,
        nombres?: string}, pagina: number, registros: number): Observable<any>;
    
    obtenerEntidades(): Observable<any>;

    buscarRequisitosNorma(codigo:string): Observable<any>;

    buscarCriterioResultado(): Observable<any>;

    obtenerTipos(): Observable<any>;

    obtenerDetectores(): Observable<any>;

    obtenerEstados(): Observable<any>;

    obtenerAuditores(): Observable<any>;

    obtenerObservadores(): Observable<any>;

    buscarDatosAuditoriaCodigo(codigo:any): Observable<any>;

    procesar(auditoria:Auditoria): Observable<any>;


}