import {MinLength, MaxLength,IsPositive, Min, IsEmpty, Equals, Contains, NotContains, ValidateNested, ValidateIf, IsNotEmpty, IsInt, IsDate, ArrayNotContains, ArrayMinSize} from 'class-validator';
import { Constante } from 'src/app/models/constante';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Documento } from 'src/app/models/documento';
import { isNull } from '@angular/compiler/src/output/output_ast';

export class SolicitudCopiaDocumento {
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
  nidrevi: string;
  /*borrar */
  fechaAprobDocu: Date;

  //Validacion
  @MinLength(1, {message: 'Seleccione un documento'})
  codigo: string;
  @IsNotEmpty({message: 'Seleccione el tipo de copia'})
  tipoCopia: string;  
  @IsNotEmpty({message: 'Se requiere el sustento'})
  sustento: string;
  @IsNotEmpty({message: 'Seleccione el motivo'})
  motivoR: string;
  //Validacion
  
  /* Aprobación  */
  
  usuarioRevision: number;
  
  //
  numerotipocopia: string;  
  @ArrayMinSize(1,{message: 'Se requiere minimo un destinatario'}) 
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
  @IsNotEmpty({message: 'Se requiere crítica'})
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
  fechaPlazoAprob:String;
  rutaDocumt: string;
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
  archivo: any;
  mensajearchivo: string;
  //como este campo lo usa un select form el valor que devuelve es string, pero el tipo de deato aqui es number..
  //para que no haya conflicto
  /*@ValidateIf(o =>  o.idmotirevi == 0 || typeof(o.idmotirevi) == "string")
  @MinLength(1,{message: 'Se requiere seleccionar un motivo revision'})
  @NotContains("0",{message: 'Se requiere seleccionar un motivo revision'})
  */idmotirevi:number=0; 
  /*@ValidateIf(o =>  o.descripcion == null)
  @MinLength(1, {message: 'Se requiere Descripción de motivo revision'})
  @MaxLength(255, {message: 'La longitud de Descripción de motivo de revision es mayor a $constraint1 caracteres'})
  */descripcion:string="";
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
  fechDistribucion: string;
  codFichaLogueado: string;
  idestejec: string;
  idUsuAprobador?:string;
  constructor(){
    this.numero=0;
  }
}


