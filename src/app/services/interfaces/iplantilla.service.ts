//import { PlanAuditoria } from "src/app/models/planauditoria";
import { Observable } from "rxjs";
import { CriterioResultado } from "src/app/models/criterioResultado";
import { ConsideracionPlan } from "src/app/models/consideracionesplan";
import { Plantilla } from "src/app/models/plantilla";
import { conocimiento } from "src/app/models/conocimiento";

export interface IPlantillaService{
    crear(): Plantilla;
    buscarPorParametros(parametros: {desplan?: string}, pagina: number, registros: number);   
    buscarPorParametrosConocimiento(parametros: {idpersona?: string}, pagina: number, registros: number);
    
    guardar(archivo:any,plantilla: Plantilla): Observable<any>;

    Eliminar(plantilla:Plantilla): Observable<any>;
    EliminarConocimiento(conocimiento:conocimiento): Observable<any>;
}