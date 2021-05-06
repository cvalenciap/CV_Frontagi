import { CargosSig } from "./../../models";
import { Observable } from "rxjs";
//import { DetalleProgramacion } from "src/app/models/detalleprogramacion";

export interface IFichaCargosSigService {
    crear(): CargosSig;
 //   obtenerTipos():Observable<any>;
    buscarPorParametros(parametros: {
      nombre?: string,
      sigla?: string, colaborador?: string}, pagina: number, registros: number): Observable<any>;
  
  //  buscarPorCodigo(codigo: number): Observable<any>;

    //buscarPorNombre(nombre: string): Observable<any>;
  
    guardar(programacion: CargosSig): Observable<any>;
  
    eliminar(programacion: CargosSig): Observable<any>;


    //eliminarDetalle(detalleProgramacion: DetalleProgramacion): Observable<any>;
}