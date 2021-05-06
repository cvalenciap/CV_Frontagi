import { SolicitudDocumentoComplementario } from "./solicituddocumentocomplementario";
import { IsNotEmpty } from "class-validator";

export class Cancelacion{
	idDocumento:number;
	//@IsNotEmpty({message: 'Se requiere obtener el código del documento'}) 
	 codigoDocumento:string;
	 tituloDocumento:string;
	 numEstadoDocumento:string;
	 idRevision:string;
	 numeroRevision:string;
	 estadoDocumento:string;
	 idSolicitudCancelacion:string;
	 numEstadoSolicitud:string;
	 estadoSolicitud:string;
	 @IsNotEmpty({message: 'Se requiere ingresar el tipo de motivo de cancelación'}) 
	 numMotivoCancelacion:string;
	 motivoCancelacion:string;
	 @IsNotEmpty({message: 'Se requiere ingresar el tipo de solicitud'})  
	 numTipoCancelacion:string;
	 tipoCancelacion:string;
	 idColaborador:string;
	 nombreColaborador:string;
	 apePatColaborador:string;
	 apeMatColaborador:string;
	 @IsNotEmpty({message: 'Se requiere ingresar el sustento de solicitud de cancelación'}) 
	 sustentoSolicitud:string;
	 sustentoAprobacion:string;
	 rutaArchivoSustento:string;
	 @IsNotEmpty({message: 'Se requiere ingresar el archivo de sustento'}) 
     nombreArchivoSustento:string;
	 sustentoRechazo:string;
	 descripcionAlcance:string;
	 @IsNotEmpty({message: 'Se requiere ingresar la gerencia'}) 
	 descripcionGerencia:string;
	 descripcionProceso:string;
	 listaSolicitudesDocComp:SolicitudDocumentoComplementario[];
	 rutaDocumento:string;
	 fechaSolicitud:Date;
	 fechaAprobacion:Date;
	 fechaCancelacion:Date;
	 Aprobador:string;
	 Cancelador:string;
	 idUsuAprobador?:string;
	 constructor(){
		 this.numTipoCancelacion = "";
		 this.numMotivoCancelacion = "";
		 this.sustentoSolicitud = "";
		 this.descripcionAlcance = "";
		 this.descripcionGerencia = "";
		 this.descripcionProceso = "";
		 this.nombreArchivoSustento = "";
		 this.codigoDocumento = "";
		 this.Aprobador="";
		 this.Cancelador="";
	 }

}