export class DetalleAccionPropuesta{
    accionPropuesta:string;
    responsable:string;
    fechaCumplimiento:Date;
    fechaReprogramacion:Date;
    justificacionReprogramacion:string;
    estadoReprogramacion:string;
    critica:string;

    constructor(){
        this.accionPropuesta = "";
        this.responsable = "";
        this.fechaCumplimiento = new Date();
        this.fechaReprogramacion = new Date();
        this.justificacionReprogramacion = "";
        this.estadoReprogramacion = "";
        this.critica = "";
    }
}