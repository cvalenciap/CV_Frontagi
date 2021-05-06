import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { ConsideracionPlan } from "./consideracionesplan";

export class PlanAuditoria{
    idPlan:string;
    codigoTipoPlan:string;
    descripcionTipoPlan:string;
    fcreacion:string;
    descripcionAuditoria:string;
    detector:string;
    estado:string;
    finicioplan:string;
    ffinplan:string;

    listaConsideracionesPlan:ConsideracionPlan[];

    constructor(){
        this.idPlan = "10";
        this.codigoTipoPlan = "";
        this.descripcionTipoPlan = "";
        this.fcreacion = "";
        this.descripcionAuditoria = "";
        this.detector = "";
        this.estado = "";
        this.finicioplan = "";
        this.ffinplan = "";
        this.listaConsideracionesPlan = [];
    }
}