import { Documento } from ".";

export class SolicitudDocumentoComplementario{
    idSolicitudCancelacion:string;
    idDocumento:number;
    indicadorSolicitud:string;
    documento:Documento;
    rutaDocumento:string;//Solo atributo para prueba
}