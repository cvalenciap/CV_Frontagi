import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class DetalleEncuesta {

	ndisdetenc:number;
	avusucre:string;
	adfeccre:Date;
	avusumod:string;
	adfecmod:Date;
	av_nomprg:string;
	niddetaencu:number;
	nidencu:number;
	@IsNotEmpty({message: 'Se requiere ingresar la descripcion de la pregunta, este campo admite un maximo de 150 caracteres'})
	@MaxLength(150, {message: 'Se requiere ingresar la descripcion de la pregunta, este campo admite un maximo de 150 caracteres'})
	vdespre:string;
	vcodetaencu:string;
	
	n_des_cur:number;
	item: number;

    constructor(){
		this.ndisdetenc=null;
		this.avusucre=null;
		this.adfeccre=null;
		this.avusumod=null;
		this.adfecmod=null;
		this.av_nomprg=null;
		this.niddetaencu=null;
		this.nidencu=null;
		this.vdespre="";
		this.vcodetaencu=null;
		
		this.n_des_cur=null;
		this.item = 0;
    }
}


