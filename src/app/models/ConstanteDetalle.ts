import {Estado} from './enums/estado';
import {Tipo} from './tipo';

export class ConstanteDetalle {
  idconstante: number;
  idconstantesuper: number;
  v_descons: string;
  v_valcons: string;
  v_abrecons:string; 
  v_nomcons:string;
  v_campcons1:string;
	v_campcons2:string;
	v_campcons3:string;
	v_campcons4:string;
	v_campcons5:string;
	v_campcons6:string;
	v_campcons7:string;
  v_campcons8:string;
  dispEstado?:string;

  constructor(){
    this.idconstante = 0;
    this.idconstantesuper=0;   
    this.v_descons = "";
    this.v_valcons = "";
    this.v_abrecons="";
    this.v_nomcons="";
    this.v_campcons1="";
    this.v_campcons2="";
    this.v_campcons3="";
    this.v_campcons4="";
    this.v_campcons5="";
    this.v_campcons6="";
    this.v_campcons7="";
    this.v_campcons8="";
    this.dispEstado="";  
  }
}



