import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { Auditor } from './auditor';

export class BandejaRevisionAuditoria {

  idBandejaRevisionAuditoria : string;
  fechaIngreso: Date;
  
  estadoInformeAuditoria: string;
  auditor: Auditor;
  equipo: string;
  gerencia: string;
  actividades: string;
  cargoAAuditar:  string;
  responsable: string;
  estadoListaVerificacion: string;


  nombre:string;
  apellidoPat:string;
  apellidoMat:string;

  numeroAuditoria: string;
  numeroLV: string;
  numeroInformeAuditoria: string;


  constructor(){
    this.idBandejaRevisionAuditoria ="";
    this.fechaIngreso = new Date();
   
    this.estadoListaVerificacion = "";
    
    this.estadoInformeAuditoria = "";
    this.auditor = new Auditor();
    this.equipo = "";
    this.gerencia = "";
    this.actividades = "";
    this.cargoAAuditar = "";
    this.responsable = ""; 

    this.nombre="";
    this.apellidoPat="";
    this.apellidoMat="";

    this.numeroAuditoria = "";
    this.numeroLV= "";
    this.numeroInformeAuditoria = "";


  }
}


