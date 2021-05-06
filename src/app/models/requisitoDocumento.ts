import { DatosAuditoria } from "./datosAuditoria";
export class RequisitoDocumento {

    nidreqdoc: Number;
    niddocu: Number;
    nidnorma: Number;
    nidnorreq: Number;
    nidrequisito: Number;
    vestreqdoc: string;
    vcodigo: string;
    vdocumento: string;

    datosAuditoria: DatosAuditoria;

    constructor() {
        this.datosAuditoria = new DatosAuditoria();
    }

}