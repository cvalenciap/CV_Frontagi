import { Observable } from "rxjs";

export interface IListaVerificacionService{
    buscarPorParametros(parametros:{
        estado?:string
    }, pagina: number, registros: number): Observable<any>;

    buscarPorCodigo(codigo:string): Observable<any>;

    obtenerEstados():Observable<any>;

    obtenerRequisitosAuditoria(codigo:number): Observable<any>;

    obtenerDatosRequisitos(codigo:string): Observable<any>;
}