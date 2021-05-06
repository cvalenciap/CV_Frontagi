import { RegistroAuditor } from "./../../models/registroAuditor";
import { Observable } from "rxjs";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";

export interface IFichaRegistroAuditorService {
    crear(): RegistroAuditor;
 //   obtenerTipos():Observable<any>;
    buscarPorParametros(parametros: {
      numFicha?: string,
      nombreAuditor?: string, apePaternoAuditor?: string, apeMaternoAuditor?: string}, pagina: number, registros: number): Observable<any>;
  
  //  buscarPorCodigo(codigo: number): Observable<any>;

    //buscarPorNombre(nombre: string): Observable<any>;
  
    guardar(programacion: RegistroAuditor): Observable<any>;
  
    eliminar(programacion: RegistroAuditor): Observable<any>;


    //eliminarDetalle(detalleProgramacion: DetalleProgramacion): Observable<any>;
}