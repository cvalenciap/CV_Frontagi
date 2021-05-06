import {Estado} from './enums/estado';
import {Tipo} from './tipo';

export class ListaVerificacion {

  id : string;
  norma: string;
  requisito: string;
  auditor: string;
  evidenciaObjetiva: string;
  resultado: string;
  nroConformidad: string;
  descripcionHallazgo: string;
  fechaHallazgo: Date;
  
  constructor(){
    this.id ="";
    this.norma = "";
    this.requisito = "";
    this.auditor = "";
    this.evidenciaObjetiva = "";
    this.resultado = "";
    this.nroConformidad = "";
    this.descripcionHallazgo = "";
    this.fechaHallazgo = new Date();   
  }
}


