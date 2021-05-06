import {MinLength, MaxLength,IsPositive, Min, IsEmpty, Equals, Contains, NotContains, ValidateNested, ValidateIf, IsNotEmpty, IsInt, IsDate} from 'class-validator';
import { Constante } from 'src/app/models/constante';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Documento } from 'src/app/models/documento';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { AdjuntoMensaje } from './adjunto-mensaje';

export class RevisionDocumento {
  tabName:string;
  id: number;
  numero: number= 0;
  //@ValidateIf(o => o.estado != null)
  //@ValidateNested()
  estado: Constante;
  idHistorial:string; 
  /*borra */
  nidrevision: string; 
  /*borra */
  documento: any;
  numerosolicitud:number;
  numeromotivo: string;
  sustentosolicitud: string;
  susteso:string;
  //sdocumento: Documento[];
  colaborador:any;
  gerencia: number;
  usuarioDeAprobacion: number;
  /* Aprobación  */
  fechaAprobacion: Date;
  //@ValidateIf(o =>  o.sustento == null)
  //@MinLength(1, {message: 'Se requiere ingresar el Sustento'})
  /*borrar */
  nidrevi: string;
  /*borrar */

  //Validacion  
  codigo: string;
  sustento: string;
  motivoR: string;
  tipoCopia: string;
  idestejec: string;
  /*tipoCopia: string;
  @MinLength(1, {message: 'Se requiere Descripción del sustento'})
  @MinLength(1, {message: 'Se requiere seleccionar el motivo'})
  //@NotContains("0",{message: 'Se requiere seleccionar un motivo revision'})
  
  //Validacion
  /* Aprobación  */
  
  usuarioRevision: number;
  
  //
  numerotipocopia: string;
  listaParticipante: RutaParticipante[];
  fecha: string;
  alcance: string;
  proceso:string;
  equipo: any;
  desta:string;
  revisionActual: number;  
  titulo: string;
  //cguerra
  motivo: string;
  nrum: string;
  numerosol: string;  
  estadoSoli: string;
  fechaSolicitud: string;
  solicitantSolicitud: string ;
  destinatarioSolicitud: string ;
  indicadorestado: string;
  resumenCritica: string;
  idususoli: number;
  ///
  nmotivo : string;
  numtipoestasoli: string ;
  observa : string;
  nestcopi: string;  
  rutacopianocontrolada:string;
  //
  //cguerra
  motivoRevision:string;
  fechaPlazoAprob:string;
  rutaDocumt: string;
  rutaDocumtNueva: string;
  tipodocumento: string;
  gerenparametroid: string;
  gerenparametrodesc: string;
  anioantiguedad: string;
  iteracion:number;
  rutaDocumentoOriginal: string;
  rutaDocumentoGoogle: string;
  rutaDocumentoCopiaNoCont: string;
  rutaDocumentoCopiaCont: string;
  rutaDocumentoCopiaObso: string;
  rutaDocumentoOffice:string;
  seleccionado: boolean;
  codDocu: string;
  desDocu: string;
  numRevi: number;
  fecRevi: Date;
  antiguedadDocu: number;
  periodoOblig: number;
  responsableEquipo: string;
  idListaVerificacion:string;
  idTipDoc: string;
  idResponsableEquipo: string;
  idDocu: string;
  anio: number;
  estados: number;
  tipobusq: string;
  desestado: string;
  correlativo: string;
  idProgExistente: string;
  idestadoejec: number;
  desestadoejec: string;
  idequipo: string;
  descequipo: string;
  fechDistribucion: string;
  idEstadoProg: number;
  nombreEquipo: Date;
  cantDocRevisar: number;
  idTrimestre: number;
  cantDocu: number;
  primerTrim: number;
  segundoTrim: number;
  tercerTrim: number;
  cuartoTrim: number;
  responsableEquipoSelecc: string;
  idResponsableEquipoSelecc: number;
  fechaActual: Date;
  estEjec: string;
  //archivo: any;
  archivo: AdjuntoMensaje;
  //n_idarchadju: AdjuntoMensaje;
  mensajearchivo: string;
  codFichaLogueado: string;
  //como este campo lo usa un select form el valor que devuelve es string, pero el tipo de deato aqui es number..
  //para que no haya conflicto
  @ValidateIf(o =>  o.idmotirevi == 0 || typeof(o.idmotirevi) == "string")
  @MinLength(1,{message: 'Se requiere seleccionar un motivo revision'})
  @NotContains("0",{message: 'Se requiere seleccionar un motivo revision'})
  idmotirevi:number=0;  
  @MinLength(1, {message: 'Se requiere Descripción de motivo revision'})
  @MaxLength(255, {message: 'La longitud de Descripción de motivo de revision es mayor a $constraint1 caracteres'})
  descripcion:string="";

  //fechaAprobacion:string;
  disponible:number;
  diferenciaPlazo:number;
  fecPlazoAprobacion:string;
  motivoRechazoRev:string;
  ruta:string;
  idDocGoogleDrive:string;
  idProg: string;
	fecCreProg: string;
	estProg: string;
	usuCreProg: string;
	fechModProg: string;
	desTipoDocuProg: string;	
	anioProg: string;
  nomapellidoparterDestina:string;
  fechaRegistroSOlicit: Date;
  fechaAprobacionDocumento: Date;
  usuarioAprobacionDocumento; string;
  fechaAprobacionAnterior: Date;
  numeroAnterior: number;
  fechaCancelacion:Date;
  fechaAprobDocu: Date;

  numeroMostrar:number;
  fechaMostrar:Date;
  estiloPlazo:string;
  rutaFinal?:string;
  revisHist:boolean;

  estProgr:string;
  fechaProgramacion:string;
  fechaDistribucion:string;
  fechaEjecucion:string;
  idEquipoProgramacion:number;
  desestadoProg:string;
  equipoProgramacion:string;
  estadoFase:string;
  idProgramacion:number;

  constructor(){
    this.seleccionado=false;
    this.numero=0;
  }
}


