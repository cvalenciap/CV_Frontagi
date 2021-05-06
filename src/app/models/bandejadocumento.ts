import { Estado, EstadoDocumento, RevisionDocumento } from './enums/estado';
import { Tipo } from './tipo';
import { Documento, Parametro, Jerarquia } from 'src/app/models';
import { Colaborador } from 'src/app/models/colaborador';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';

export class BandejaDocumento {

  /*
  
//////////////////////////
  padre: Documento;
  version: number;
  retencionRevision: number;
  proceso: number;
  alcanceSGI: number;
  gerencia: number;  
  ctipoDocumento: Parametro;
  periodo: number;
  //Codigo			codigoAnterior;
  codigoAnterior: Object;
  justificacion: string;
  motivoRevision: Parametro;
  emisor: Colaborador;
  fase: Parametro;
  nombreArchivo: string;
  rutaArchivo: string;
  disponible: number;
  nodo: Jerarquia;
  indicadorAvance: string;
  estadoDercarga: string;
  raiz: string;
  copia: Object;
  //List<Codigo>		listaCodigo;
  listaCodigo: Object[];
  participanteElaboracion: RutaParticipante[];
  participanteConsenso: RutaParticipante[];
  participanteAprobacion: RutaParticipante[];
  participanteHomologacion: RutaParticipante[];  
  listaComplementario: Documento[];
  listaEquipo: Equipo[];
  listaParticipante: RutaParticipante[];
  
  
  
      //List<Revision>		listaRevision;
      listaRevision: Object[];
      idHistorial: number;
      tipoComplementario: Parametro;
      estadoDisponible: Estado;
      jgerencia: Jerarquia;
      revisonobligatoria: string;
      estado: Parametro;
   //Tipo de Documento  
      tipoDocumento1: number;       
      tipoDocumento: string; 
      revision: RevisionDocumento = new RevisionDocumento();
  //bandeja documento
  */

  tabName: string;
  id: number;
  codigo: number;
  numero: string;

  //fecha: Date;
  descripcion: string;
  tipo: Tipo;
  estado: EstadoDocumento;
  //fechaRegistro: Date;
  responsable: string;
  //fechaString: String;
  //Datos de revision
  revision: RevisionDocumento;
  idrevision: string;
  revisionfecha: string;
  numbero: string;
  titulo: string;
  estdoc: string;
  fecharevdesde: Date;
  fecharevhasta: Date;
  fechaaprobdesde: Date;
  fechaaprobhasta: Date;
  tipodocumento: number;
  periodooblig: string;
  motirevision: string;
  numrevi: string;
  parametrodesc: string;
  parametroid: number;
  procesoparametroid: string;
  sgiparametroid: string;
  gerenparametroid: string;
  descripcionarea: string;
  idarea: string;
  descparticipante: string;
  idparticipante: string;
  idfaseact: string;
  idfaseestadoact: string;
  procesoparametrodesc: string;
  sgiparametrodesc: string;
  gerenparametrodesc: string;
  rutaCompleta: string;
  tipoBusq: string;
  idTipoDocu: string;

  habilitarGerencia: boolean;

  constructor() {
    this.tipo = new Tipo();
    this.tipo.codigo = "";
    this.tipo.descripcion = "";
    this.codigo = 0;
    this.descripcion = "";    
    this.responsable = "";
    this.tipodocumento = 0;
    this.titulo = "";
    this.estdoc = "";
    this.rutaCompleta = "";
  }
}


