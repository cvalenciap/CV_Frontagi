//import {OrigenDocumento, EstadoDocumento, PrioridadDocumento} from '../models/enums';
//import {TipoDocumento} from '../models';

export class FiltroDocumento {
  idalcasgi?: string;
  idgeregnrl?:string;
  idTipoDoc?:number;
  nano: number;
  idproceso?: string;
  idrevision?: string;
  //origen?: OrigenDocumento;
  correlativo?: number;
  numero?: string;
  //estado?: EstadoDocumento;
  fechaDocumentoInicio?: Date;
  fechaDocumentoFin?: Date;
  asunto?: string;
 // prioridad?: PrioridadDocumento;
  remitente?: string;
  titulo?: string;
  estdoc 							?:	string;	
  fecharevdesde				?:	string;	
  fecharevhasta				?:	string;	
  tipodocumento				?:	string;	
  periodooblig 				?:	string;	
  motirevision 				?:	string;	
  numrevi 						?:	string;	
  procesoparametroid 	?:	string;	
  sgiparametroid 			?:	string;	
  gerenparametroid		?:	string;	
  idarea 							?:	string;	
  idparticipante 			?:	string;	
  idfaseact 					?:	string;	
  idfaseestadoact 		?:	string;	
  tipoBusq						?:	string;	
  
}

