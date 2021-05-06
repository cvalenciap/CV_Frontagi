import { Auditor } from "./auditor";
import { RegistroAuditor } from "./registroAuditor";
import { Comite } from "./comite";
import { AuditorAuditoria } from "./auditorauditoria";

export class RequisitoAuditoriaRegistro{

    idDetalleAuditoria:string;
    fecha:Date;
    norma:string;
    alcance:string;
    valorTipoEntidad:string;
    valorEntidadGerencia:string;
    valorEntidadEquipo:string;
    valorEntidadCargo:string;
    valorEntidadComite:string;
    descripcionEntidad:string;

    listaParticipante:AuditorAuditoria[];
    listaParticipantesAux:AuditorAuditoria[];
    listaComite:Comite[];
    listaComiteAux:Comite[];
    listaRequisitos:any[];


    fechaRequisito:Date;
    fechaDia:string;
    fechaHora:string;
    area:string;
    descripcionNorma:string;
    requisito:string;
    auditor:string;

    constructor(){
        //this.fechaHora = new Date();
        this.norma = "";
        this.alcance = "";
        this.valorTipoEntidad = "0";
        this.valorEntidadGerencia = "";
        this.valorEntidadEquipo = "";
        this.valorEntidadCargo = "";
        this.valorEntidadComite = "";
    }
    
}