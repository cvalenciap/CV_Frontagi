import { DatosAuditoria } from "./datosAuditoria";
import { RequisitoRelacionado } from "./requisitoRelacionado";
import { RequisitoDocumento } from "src/app/models/requisitoDocumento";

export class NormaReq{
    idNorReq:string;
    idNorma:string;
    idRequisito:string;
    orden:string;
    nivel:string;
    estado:Number;
    descripcionReq:string;
    idRequisitoPadre:string;
    requisitoRelacionado:RequisitoRelacionado[];
    requisitoDocumento:RequisitoDocumento[];
    datosAuditoria:DatosAuditoria;

    constructor(){
        this.estado = 1;
        this.requisitoRelacionado = new Array<RequisitoRelacionado>();
        this.requisitoDocumento = new Array<RequisitoDocumento>();
        this.datosAuditoria = new DatosAuditoria();
    }
}