import { DatosAuditoria } from "./datosAuditoria";
import { HallazgoRequisito } from "./hallazgoRequisito";

export class ListaVerificacionRequisito{
    idLVRequisito:number;
	idListaVerificacion:number;
	idRequisito:number;
	idDetalleRequisito:number;
	detalleRequisito:string;
	cuestionarioRequisito:string;
	idNorma:number;
	descripcionRequisito:string;
	descripcionNorma:string;
	datosAuditoria:DatosAuditoria;
	valorCalificacion:string;
	descripcionCalificacion:string;
	hallazgo:HallazgoRequisito;
}