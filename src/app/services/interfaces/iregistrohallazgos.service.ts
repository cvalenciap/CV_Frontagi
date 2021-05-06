import { Observable } from "rxjs";

export interface IRegistroHallazgosService{
    buscarPorParametros(parametros:{
        estado?:string
    }, pagina: number, registros: number): Observable<any>;

    buscarPorCodigo(codigo:string):Observable<any>;

    obtenerEstados():Observable<any>;

    obtenerAuditoresHallazgo(codigo:string):Observable<any>;

    obtenerRequisitosAuditoria(codigo:string):Observable<any>;

    obtenerDatosRequisitos(codigo:string): Observable<any>;

    obtenerCriterios(codigo:string):Observable<any>;

    
}