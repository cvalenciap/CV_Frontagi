import {Estado} from './enums/estado';
import {Tipo} from './tipo';

export class ListaEnviarInformes {
  
  id : string;
  categoria: string;
  fecha: Date;
  descripcionHallazgo: string;
  
                     
  constructor(){
    this.id ="";
    this.categoria = "";
    this.fecha = new Date();
    this.descripcionHallazgo = "";
       
  }
}


