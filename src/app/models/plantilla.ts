import { ConsideracionPlan } from "./consideracionesplan";
import { CriterioResultado } from "./criterioResultado";
import { DatosAuditoria } from "./datosAuditoria";
import { Norma } from "./norma";
import { RequisitoAuditoriaRegistro } from "./requisitoauditoriaregistro";
import { Programa } from "./programa";

export class Plantilla{
    idplan:number;  
	desplan: string;
	nomplan: string;
	rutplan: string;
    displan:number;
    tipoplan:string;
    constructor(){
        
        this.desplan="";
        this.nomplan = "";
        this.rutplan = "";   
        this.tipoplan="";    
    }
}