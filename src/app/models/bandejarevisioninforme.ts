import {Estado} from './enums/estado';
import {Tipo} from './tipo';

export class BandejaRevisionInforme {

  idBandejaRevisionInforme : string;
  numeroAuditoria: string;
  numIA: string;
  estadoIA: string;
  fecha: Date;
  auditorLider: string;
  equipo: string;
  responsable: string;
  conclusiones: string;

  numeroAuditor:string;
  apellidoPat:string;
  apellidoMat:string;
  nombre:string;

  constructor(){
    this.idBandejaRevisionInforme ="";
    this.numeroAuditoria="";
    this.numIA = "";
    this.estadoIA = "";
    this.fecha = new Date();
    this.auditorLider="";
    this.equipo = "";
    this.responsable = ""; 
    this.conclusiones=""; 
    
    this.numeroAuditor="";
    this.apellidoPat="";
    this.apellidoMat="";
    this.nombre="";


  }
}


