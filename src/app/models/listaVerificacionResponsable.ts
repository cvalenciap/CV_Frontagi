import {Estado} from './enums/estado';
import {Tipo} from './tipo';

export class ListaVerificacionResposable {

  id : string;
  norma: string;
  evidenciaObjetiva: string;
  resultado: string;
  nroConformidad: string;
  descripcionHallazgo: string;
  fechaHallazgo: Date;
  
  constructor(){
    this.id ="";
    this.norma = "";
    this.evidenciaObjetiva = "";
    this.resultado = "";
    this.nroConformidad = "";
    this.descripcionHallazgo = "";
    this.fechaHallazgo = new Date();   
  }
}


