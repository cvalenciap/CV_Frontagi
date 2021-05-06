import { DatosAuditoria } from './datosAuditoria';
import { Requisito } from './requisito';

/*import { DatosAuditoria } from "./datosAuditoria";
import { NormaReq } from "./normaReq";
import { IsNotEmpty } from "class-validator";*/


export class Norma {

    n_id_normas: number;
    v_tipo: string;
    v_nom_norma: string;
    v_st_reg: string;
    datosAuditoria: DatosAuditoria;
    // requisitos: Requisito[];
    /* idNorma:string;
     @IsNotEmpty({message: 'Se requiere ingresar la descripción de la norma o incidencia'})
     descripcionNorma:string;
     @IsNotEmpty({message: 'Se requiere ingresar el tipo de norma o incidencia'})
     tipo:string;
     estado:Number;
     normaReq: NormaReq[];
     datosAuditoria:DatosAuditoria;
 
     constructor(){
         this.idNorma = "";
         this.descripcionNorma = "";
         this.tipo = "";
         this.estado = 0;
         this.normaReq =  new Array<NormaReq>();
         this.datosAuditoria = new DatosAuditoria();
     } */
}