import { DatosAuditoria } from "./datosAuditoria";
export class RequisitoRelacionado{
    
    idReqRela:string;
    idNorReq:string;
    idNorma:Number;
    idRequisito:Number;
    normaRelacionada:string;
    requiRelacionado:string;
    datosAuditoria:DatosAuditoria;
    vestreqrel:string;

    vdetreq:string;
	vcuesti:string;

    constructor(){
        this.datosAuditoria = new DatosAuditoria();
    }

}