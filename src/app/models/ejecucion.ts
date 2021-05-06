export class Ejecucion {
    idPlanAccion:number;
    idEjecucion:number;
    numeral: string;
    descripcionAccionPropuesta: string;
    descripcionAccionEjecutada:string;
    fechaEjecucion:Date;
    descripcionVerificacion:string;
    descripcionResponsable:string;
    fechaCumplimiento:Date;
    estadoRegistro:string;
    archivoAdjunto:File;
    
    constructor(){
        this.idPlanAccion = 0;
        this.idEjecucion = 0;
        this.numeral = "";
        this.descripcionAccionPropuesta = "";
        this.descripcionAccionEjecutada = "";
        this.fechaEjecucion = new Date();
        this.descripcionVerificacion = "";
        this.descripcionResponsable = "";
        this.fechaCumplimiento = new Date();
        this.estadoRegistro = "";
    }
}