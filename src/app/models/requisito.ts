import { DatosAuditoria } from "./datosAuditoria";
import { RequisitoRelacionado } from "./requisitoRelacionado";

export class Requisito {
    n_id_requisito: number;
    n_id_normas: number;
    v_num_req: string;
    v_nom_req: string;
    n_nivel_req: number;
    n_id_req_padre: number;
    n_auditable: number;
    v_desc_req: string;
    v_st_reg: string;
    datosAuditoria: DatosAuditoria;

    v_nom_norma?: string;
    /* idRequisito:String;
     orden:String;
     nivel:String;
     descripcionReq:String;
     idRequisitoPadre:String;
     idRequisitoPadreTMP:String;
     requisito:Requisito[];
     requisitoRelacionado:RequisitoRelacionado[];
     datosAuditoria:DatosAuditoria;
 
     constructor(){
         this.requisitoRelacionado = new Array<RequisitoRelacionado>();
         this.datosAuditoria = new DatosAuditoria();
     } */
}