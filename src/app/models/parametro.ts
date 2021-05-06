import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import {  IsNotEmpty, MinLength, ValidateIf, NotContains, NotEquals, MaxLength, Max} from 'class-validator';

export class Parametro {
  codigo?: number;
  codigorevision?: string;
  codigoDoc?: string;
  //Eliminar
  id?: number;
  idconstante?: number;
  idconstantesuper?: number;
  @IsNotEmpty({message: 'Se requiere ingresar una descripción del parámetro, este campo admite un maximo de 255 caracteres'})
  @MaxLength(255, {message: 'Este campo admite un maximo de 100 caracteres'})
  v_descons?: string;
  v_valcons?: string;
  v_abrecons?:string;
  @IsNotEmpty({message: 'Se requiere ingresar nombre del parámetro, este campo admite un maximo de 100 caracteres'})
  @MaxLength(100, {message: 'Este campo admite un maximo de 100 caracteres'})
  v_nomcons?:string;
  v_campcons1?:string;
	v_campcons2?:string;
	v_campcons3?:string;
	v_campcons4?:string;
	v_campcons5?:string;
	v_campcons6?:string;
	v_campcons7?:string;
	v_campcons8?:string;
  //Eliminar
  fecha?: Date;
  descripcion?: string;
  tipo?: Tipo;
  estado?: Estado;
  fechaRegistro?: Date;
  responsable?: string;
  fechaString?: string;
  idproc?: string;
  idalcasgi?: string;
  idgeregnrl?: string;
  titulo?: string;
  estdoc?: string;
  fecharevdesde?: Date;
  fecharevhasta?: Date;
  fechaaprobdesde?: Date;
  fechaaprobhasta?: Date;
  periodooblig?: string;
  motirevision?: string;
  numrevi?: string;
  idarea?: string;
  idparticipante?: string;
  idfaseact?:string;
  idfaseestadoact?:string;
  coddocu?: string;
  idrevi?: string;
  desDocu?: string;
  plazodiferencia?: number;
  idDocGoogleDrive?: string;
  tipodocumento?: number;
  idTipoDoc?: number;
  itemColumna?:number;
  listaDetalle?:Parametro[];
  dispEstado?:string;
  constructor(){
    this.idconstante = 0;
    this.idconstantesuper=0;
    this.tipo = new Tipo();
    this.tipo.codigo = "";
    this.tipo.descripcion = "";
    this.codigo = 0;
    this.codigorevision = "";
    this.codigoDoc = "";
    this.descripcion = "";
    this.estado = Estado.ACTIVO;
    //this.fechaRegistro = new Date();
    this.fecha = new Date();
    this.responsable = "";
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
    this.idproc = "";
    this.idalcasgi = "";
    this.idgeregnrl = "";
    this.titulo = "";
    this.estdoc = "";
    this.idDocGoogleDrive = "";
    this.itemColumna=0;
    this.listaDetalle=[];
    this.dispEstado="";
  }
}



