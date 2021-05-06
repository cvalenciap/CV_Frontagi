export class DocumentoInternoCap {
    idCapacitacion: number;
    idDocumento : number;
    codigoDocumento : string;
    nombreDocumento : string;
    idRevision : string;
    fechaRevisionDocu : Date;
    tipoDocumento : number;
    descTipoDoc : string;
    itemColumnaDoc : number;
    disponibilidad : number;
    constructor(){
        this.idDocumento = 0;
        this.codigoDocumento = "";
        this.nombreDocumento = "";
        this.idRevision = "";
        this.fechaRevisionDocu = null;
        this.tipoDocumento = 0;
        this.descTipoDoc = "";
        this.itemColumnaDoc = 0;
        this.disponibilidad = 0;
    }
}