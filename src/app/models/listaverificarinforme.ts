import {Estado} from './enums/estado';
import {Tipo} from './tipo';

export class ListaVerificarInforme {

  idVerificarInforme : string;
  norma: string;
  requisitoDocumento: string;
  descripcionHallazgo:string;
  itemLV: string;
  categoria: Date;
  observacion: string;

  constructor(){
    
    this.idVerificarInforme ="";
    this.norma="";
    this.requisitoDocumento = "";
    this.descripcionHallazgo ="";
    this.itemLV = "";
    this.categoria = new Date();
    this.observacion="";

  }
}


