import { ConsideracionPlan } from "./consideracionesplan";
import { CriterioResultado } from "./criterioResultado";
import { DatosAuditoria } from "./datosAuditoria";
import { Norma } from "./norma";
import { RequisitoAuditoriaRegistro } from "./requisitoauditoriaregistro";
import { Programa } from "./programa";

export class conocimiento{
    idconocimiento:number;  
    idpersona:number;  
    iddocumento:number;  
    estado:number;    
    indicador:number;
    idrevision:number;
    constructor(){          
    }
}