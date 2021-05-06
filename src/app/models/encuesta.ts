import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { DetalleEncuesta } from 'src/app/models/detalle-encuesta';
import { IsNotEmpty, ArrayMinSize } from 'class-validator';

export class Encuesta { 
    
    nidcurs:number;
	nidencu:number;
	avusucre: string;
	adfeccre:Date;
	avusumod: string;
	adfecmod:Date;
	avnomprg: string;
	ndisencu:number;
	@IsNotEmpty({message: 'Se requiere ingresar el codigo de la encuesta'})
	vcodencu: string;
	@IsNotEmpty({message: 'Se requiere ingresar el nombre de la encuesta'})
	vnomencu: string;

	vdescur: string;
	@IsNotEmpty({message: 'Se requiere selecionar el curso'})
	v_cod_cur: string;
	@ArrayMinSize(1,{message: 'requiere minimo una pregunta'}) 
	listaDetEncuesta: Array<DetalleEncuesta>;
 
    constructor(){
		this.nidcurs=null;
		this.nidencu=0;
		this.ndisencu=null;
		this.vcodencu=null;
		this.vnomencu=null;
		this.v_cod_cur = null;
		this.vdescur=null;
    }
}

