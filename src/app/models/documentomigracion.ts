import {Estado} from './enums/estado';
import {Parametro} from 'src/app/models/parametro';
import {Equipo} from 'src/app/models/equipo';
import {Jerarquia} from 'src/app/models/jerarquia';
import {Colaborador} from 'src/app/models/colaborador';
import {RevisionDocumento} from 'src/app/models/revisiondocumento';
import {ValidateNested,MaxLength,MinLength,IsDefined,ValidateIf,NotEquals, ArrayNotEmpty, IsString, IsNotEmpty, IsInt, IsDate, Min} from 'class-validator';
import {Codigo} from 'src/app/models/codigo';
import {RutaParticipante} from 'src/app/models/rutaParticipante';
import {Tipo,BandejaDocumento, Documento} from 'src/app/models';
import {Constante} from 'src/app/models/constante';
import {Critica} from "./critica";
import { Fase } from './fase';
import { RevisionDocumentoMigracion } from './revisiondocumentomigracion';

export class DocumentoMigracion {
    
    tabName:string;
    id: number;
    
    @IsDate({message: 'Se requiere ingresar Fecha de Registro valida'})
    @IsNotEmpty({message: 'Se requiere ingresar Fecha de Registro'})            
    fechaCreaDoc: Date;
   /* @IsInt({message: 'Se requiere ingresar el Colaborador de Registro valido'})
    @IsNotEmpty({message: 'Se requiere ingresar el Colaborador de Registro'})  
    @Min(1)  
    
  */
    idcolaboracioncreaciondoc : number;
    numeroderevision: number;
    @MinLength(1, {message: 'Se requiere Código de documento'})
    codigo: string="";
    @MinLength(1, {message: 'Se requiere ingresar titulo de documento'})
    descripcion: string;
    padre: Documento;
    version: number;
    rutaDocumento?:string;
    urlDocumento?: string;
    responsable: string;
    estado: Parametro;
    /*/*/
    rutaDocumentoOriginal?: string;
    rutaDocumentoCopiaNoCont?: string;
    rutaDocumentoCopiaCont?: string;
    rutaDocumentoCopiaObso?: string;


    retencionRevision: number;
    //proceso: Parametro[];
    proceso: string;
    alcanceSGI: string;
    @IsInt({message: 'Se requiere ingresar la Gerencia'})
    @IsNotEmpty({message: 'Se requiere ingresar la Gerencia'})      
    @Min(1)
    gerencia: number;
   // gerencia1: string;
    //gerencia: Parametro;
    idrevision: string;
    ctipoDocumento: Parametro;
    fecha: Date;
    
    //Codigo            codigoAnterior;
    codigoAnterior: Codigo;
    justificacion: string;
    motivoRevision: Parametro;
    emisor: Colaborador;
    fase: Parametro;
    revisionfecha: string;
    nombreArchivo: string;
    rutaArchivo: string;
    @ValidateIf(o => o.revision != null)
    @ValidateNested()
    revision: RevisionDocumentoMigracion = new RevisionDocumentoMigracion();
	disponible: number;
    nodo: Jerarquia;
    indicadorAvance: string;
    estadoDercarga: string;
    raiz: string;
   //bandeja documento
    tipo: Tipo;
    //bandeja documento
    //Copia			copia; 
    copia: Object;
    //List<Codigo>		listaCodigo;
    listaCodigo: Object[];
    @ArrayNotEmpty({message: "Se requiere agregar participante en la Elaboracion" }) // Se requiere agregar participante en la Elaboraci?n
    participanteElaboracion: RutaParticipante[];
    participanteConsenso: RutaParticipante[];
    participanteAprobacion: RutaParticipante[];
    participanteHomologacion: RutaParticipante[];
    @ValidateIf(o => o.bitacora != null)
    @ValidateNested()
    bitacora: Fase = new Fase();
    faseElaboracion: Fase;
    faseConsenso: Fase;
    faseAprobacion: Fase;
    faseHomologacion: Fase;
    participanteBitacora: RutaParticipante[];  
    //listaComplementario: BandejaDocumento[];
    listaComplementario: DocumentoMigracion[]; 
    listaEquipo: Equipo[]; 
    
     //cguerra
   
      indicadorequiRes: Equipo = new Equipo();

     //cguerra

/* Participantes*/ 
    listaParticipante: RutaParticipante[];

    //List<Revision>		listaRevision;
    listaRevision: Object[];
    idHistorial: number;
    tipoComplementario: Parametro;
    estadoDisponible: Estado;
    jgerencia: Jerarquia;
    jalcanceSGI: Jerarquia;
    jproceso: Jerarquia;
    estadoFaseActual: Constante;
    //todosCheck esta variable se le asigna fuera del model
    @ValidateIf(o => o.todosCheck == true)
    @MinLength(1, {message: 'Se requiere ingresar revision obligatoria'})
    @NotEquals("0", {message: 'Se requiere ingresar revision obligatoria'})
    periodo: string;
    /*Tipo de Documento */
    tipoDocumento: string;
    coordinador: Colaborador;
    indicadorDigital: number;
    indAprobacionSoli: string;
    indicadorSolicitudRevision: string;
     critica: Critica;
    indicadorFase: string;
    indicadorAprobado: string;

    constructor(){   
        
        this.proceso;
        this.gerencia;
        this.alcanceSGI;
        //this.tipoDocumento = 86;   
        //this.revisonobligatoria=null;
        this.codigo = "";
        this.descripcion = "";
        this.estadoDisponible = Estado.ACTIVO;
        this.listaCodigo = [];
        this.participanteElaboracion = [];
        this.responsable = "";
        this.participanteConsenso = [];
        this.participanteAprobacion = [];
        this.participanteHomologacion = [];
        this.faseElaboracion = new Fase();
        this.faseConsenso = new Fase();
        this.faseAprobacion = new Fase();
        this.faseHomologacion = new Fase();
        this.listaComplementario = [];
        this.listaEquipo = [];
        this.listaRevision = [];
        this.ctipoDocumento = new Parametro();
        this.jgerencia = new Jerarquia();
        this.jalcanceSGI = new Jerarquia();
        this.jproceso = new Jerarquia();
        this.tipoComplementario = new Parametro();
        this.periodo = "";
        this.fechaCreaDoc = null;
        this.idcolaboracioncreaciondoc  = null;
	this.indicadorDigital = 0;
        this.indAprobacionSoli = "";
        this.indicadorSolicitudRevision = null;
        this.indicadorFase = null;
        this.fase = new Parametro();
        this.indicadorAprobado = "0";
        this.coordinador = new Colaborador();
        
    }
}

