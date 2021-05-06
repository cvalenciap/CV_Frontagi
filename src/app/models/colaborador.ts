import {Estado} from './enums/estado';
import {Equipo} from 'src/app/models/equipo';

export class Colaborador {
  
  idColaborador: number;
  id: number;
  funcion: string; 
  equipo: Equipo;
  nombreCompleto: string;
  estado: string;
 
  estadoDisponible: Estado;
  // itemColumna: number;
  itemColumnaPart: number;
  idRolAuditor:any;
  apellidoPaterno :string;
  apellidoMaterno :string;
  nombre:string;
  numeroFicha:string;
  dni:string;
  descripcionEquipo: string;
  idEquipo: number;
  disponible : number;
  numFicha: number;
  indEnvio : number;
  constructor(){
    this.itemColumnaPart = 0; 
    this.id = 0;
    this.funcion = "";
    this.equipo = null;
    this.nombreCompleto = "";
    this.apellidoPaterno="";
    this.apellidoMaterno="";
    this.nombre="";
    this.idRolAuditor="";
    this.numeroFicha="";
    this.descripcionEquipo = "";
    this.indEnvio = 0;
  }
}