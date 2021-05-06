import { DatosAuditoria } from "./datosAuditoria";

export class Programa{
    idPrograma:number;
    descripcionPrograma:string;
    fechaPrograma:Date;
    estadoPrograma:string;
    datosAuditoria:DatosAuditoria;
    usuarioCreacion:string;
    fechaCreacion:Date;
    usuarioModificacion:string;
    fechaModificacion:Date;
    procesoPrograma:string;
/**/
    tipocopi: string;
    nombre: string;
    apellpatern: string; 
    apellmatern: string;
    equipo: string;
/**/
    constructor(){
        this.datosAuditoria = new DatosAuditoria();
    }

}