import { Trabajador } from "./trabajador";

export class RequisitoHallazgo{
  id:string;
  documentos:any[];
  detalleRequisito:string;
  preguntasRequisito:any[];
  calificacion:string;
  tipoHallazgo:string;
  fechaHallazgo:Date;
  descripcionHallazgo:string;
  listaAuditados:Trabajador[];
  archivoEvidencia:File;
  listaRequisitosRelacionados:any[];

  constructor(){
    this.listaAuditados = [];
    this.listaRequisitosRelacionados = [];
  }

}