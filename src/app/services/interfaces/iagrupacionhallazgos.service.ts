import { Observable } from "rxjs";

export interface IAgrupacionHallazgosService{
    buscarPorParametros(parametros:{
        tipo?:string
    }, pagina: number, registros: number): Observable<any>;

    obtenerTipoNoConformidad():Observable<any>;

    obtenerEquipos(): Observable<any>
    
}