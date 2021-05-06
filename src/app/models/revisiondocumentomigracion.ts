import {MinLength, MaxLength,IsPositive, Min, IsEmpty, Equals, Contains, NotContains, ValidateNested, ValidateIf, IsNotEmpty, IsInt, IsDate} from 'class-validator';
import { Constante } from 'src/app/models/constante';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Documento } from 'src/app/models/documento';
import { isNull } from '@angular/compiler/src/output/output_ast';

export class RevisionDocumentoMigracion {
  tabName:string;
  id: number;
  codigo: string;
  numero: number= 0;
  //@ValidateIf(o => o.estado != null)
  //@ValidateNested()
  estado: Constante;
  idHistorial:string; 
  documento: any;
  numerosolicitud:number;
  numeromotivo: string;
  sustentosolicitud: string;
  susteso:string;
  //sdocumento: Documento[];
  colaborador:any;
  gerencia: number;
  sustento: string;
  motivoR: string;
  /* Aprobación  */
  
  usuarioRevision: number;
  
  //
  numerotipocopia: string;
  listaParticipante: RutaParticipante[];
  fecha: string;
  tipoCopia: string;
  alcance: string;
  proceso:string;
  equipo: any;
  desta:string;
  revisionActual: number;  
  titulo: string;
  //cguerra
  nrum: string;
  numerosol: string;  
  estadoSoli: string;
  fechaSolicitud: string;
  solicitantSolicitud: string ;
  destinatarioSolicitud: string ;
  indicadorestado: string;
  idususoli: number; 
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
  //como este campo lo usa un select form el valor que devuelve es string, pero el tipo de deato aqui es number..
  //para que no haya conflicto
  @ValidateIf(o =>  o.idmotirevi == 0 || typeof(o.idmotirevi) == "string")
  @MinLength(1,{message: 'Se requiere seleccionar un motivo revision'})
  @NotContains("0",{message: 'Se requiere seleccionar un motivo revision'})
  idmotirevi:number=0;
  @MinLength(1, {message: 'Se requiere Descripción de motivo revision'})
  @MaxLength(255, {message: 'La longitud de Descripción de motivo de revision es mayor a $constraint1 caracteres'})
  descripcion:string="";
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

  /*@IsInt({message: 'Se requiere ingresar el usuario Aprobador de la solicitud valido'})
  @IsNotEmpty({message: 'Se requiere ingresar el usuario Aprobador de la solicitud'})
  @Min(1)
  */
  usuarioDeAprobacion: number;
  @IsDate({message: 'Se requiere ingresar Fecha Aprobación de la solicitud valido'})
  @IsNotEmpty({message: 'Se requiere ingresar Fecha Aprobación de la solicitud'})
  fechaAprobacion: Date;
  //@IsDate({message: 'Se requiere ingresar Fecha Registro de la solicitud valido'})
  //@IsNotEmpty({message: 'Se requiere ingresar Fecha Registro de la solicitud'})
  fechaRegistroSOlicit: Date;

  constructor(){
    //this.numero=0;
    this.usuarioDeAprobacion = null;
    this.fechaAprobacion = null;
    this.fechaRegistroSOlicit = null;
  }
}


