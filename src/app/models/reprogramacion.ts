export class Reprogramacion {
    idNoConformidad:number;
    idPlanAccion:number;
    descripcionAccionPropuesta:string;
    descripcionResponsable:string;
    fechaCumplimiento:Date;
    estadoRegistro:string;
    descripcionCritica:string;
    descripcionAccionEjecutada:string;
    fechaEjecucion:Date;
    descripcionVerificacion:string;
    archivoAdjunto:File;
    valorAccion: string;

    constructor(){
        this.idNoConformidad = 0;
        this.idPlanAccion = 0;
        this.descripcionAccionPropuesta = "";
        this.descripcionResponsable = "";
        this.fechaCumplimiento = new Date();
        this.estadoRegistro = "";
        this.descripcionCritica = "";
        this.descripcionAccionEjecutada = "";
        this.fechaEjecucion = new Date();
        this.descripcionVerificacion = "";
        this.valorAccion = "";
    }
}