import {Estado} from './enums/estado';
import { NotContains, IsNotEmpty, MinLength, NotEquals, ValidateIf } from 'class-validator';

export class Jerarquia {
  codigo: number;
  idJerarquia: number;
  id: number;
  idPadre: number;
  fecha: Date;  
  @NotContains("\\",{message: 'La descripción no debe tener el caracter '+'\\'})
  @IsNotEmpty({message: 'Debe ingresar descripción'})
  descripcion: string;
  tipo: string;
  idTipo: number;
  estado: Estado;
  nivel: number;
  ruta: string;
  fechaRegistro: Date;
  responsable: string;
  fechaString: string;
  v_descons: string;
  idTipoDocu: number;
  valModificar?:boolean;
  nombre?:string;
  detAnterior?:string;
  nomAnterior?:string;
  descDocumento?:string;
  listHijos?:Jerarquia[];
  listDoc?:Jerarquia[];
  mensajeDoc:boolean;
  listaDetalleDoc:Jerarquia[];
  nomNodo:string;
  cantidadDocumentos?:number;
  abrJera?:string;
  seleccionado: boolean;  
  indicadorDescargas: number;
  constructor(){
    this.tipo = "";
    this.id = 0;
    this.nivel = 0;
    this.descripcion = "";
    this.estado = Estado.ACTIVO;
    //this.fechaRegistro = new Date();
    this.fecha = new Date();
    this.responsable = "";
    this.idJerarquia = 0;
    this.idTipoDocu = 0;
    this.valModificar=false;
    this.nombre="";
    this.detAnterior="";
    this.nomAnterior="";
    this.descDocumento="";
    this.listDoc=[];
    this.listHijos=[];
    this.mensajeDoc=false;
    this.listaDetalleDoc=[];
    this.nomNodo="";
    this.cantidadDocumentos=0;
    this.abrJera="";    
  }
}

