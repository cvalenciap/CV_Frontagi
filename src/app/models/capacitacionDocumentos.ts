export class CapacitacionDocumentos{
    idCapacitacion: number;
    idDocumento : number;
    rutaDocumento : string;
    nombreDocumento : string;
    itemColumD : number;
    disponibilidad : number;
    constructor(){
        this.idCapacitacion = 0;
        this.idDocumento = 0;
        this.rutaDocumento = "";
        this.nombreDocumento = "";
        this.itemColumD = 0;
        this.disponibilidad = 0;
    }
}