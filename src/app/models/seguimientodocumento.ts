import { Parametro } from ".";

export class SeguimientoDocumento{
    idDocumento:number;
    codDocumento:string;
    desDocumento:string;
    motivoRevision:Parametro;
    estadoDocumento:Parametro;
    idRevision:number;
    numeroRevision:number;
    numeroIteracion:number;
    fechaRevision:Date;
    fechaRechazoRevision:Date;
    fechaAprobacionRevision:Date;
    faseActual:Parametro;
    textoFase:string;
    textoEstadoFase:string;
}