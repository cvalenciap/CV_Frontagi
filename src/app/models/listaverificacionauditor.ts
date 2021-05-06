import { Auditoria } from "./auditoria";
import { DatosAuditoria } from "./datosAuditoria";
import { NodoRequisitoLV } from "./nodoRequisitoLV";
import { ListaVerificacionRequisito } from "./listaVerificacionRequisito";
import { ListaVerificacionAuditado } from "./listaverificacionauditado";

export class ListaVerificacionAuditor{
    checked: boolean;
    idListaVerificacion:string;
    estadoListaVerificacion:string;
    calificacionLV:string;
    idSustento:number;
    sustentoRechazo:string
    usuarioCreacion:string;
    fechaCreacion:Date;
    usuarioModificacion:string;
    fechaModificacion:Date;
    rutaSustento:string;
    tipoLV:string;
    descripcion:string;

    norma:string;
    descripcionAuditoria:string;
    auditorLider:string;
    auditor:string;
    descripcionEntidad:string;
    descripcionEstado:string;

    idAuditoria:string;
    fecha:Date;
    codigoGerencia:string;
    codigoEquipo:string;
    codigoCargo:string;
    codigoComite:string;
    valorEntidad:string;
    nombreArchivoEvidencia:string;
    idArchivoEvidencia:number;

    estadoRevisionHallazgos:string;
    textoNormas:string;
    textoAuditores:string;

    datosAuditoria:DatosAuditoria;

    listaRequisitosLV:ListaVerificacionRequisito[];
    listaNodosRequisitoLV:NodoRequisitoLV[];
    listaAuditadosLV:ListaVerificacionAuditado[];

    auditoria:Auditoria;//Para cuando lo organize todo
}