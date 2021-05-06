import {Estado} from './enums/estado';
import {Parametro} from 'src/app/models/parametro';
import {Equipo} from 'src/app/models/equipo';
import {Jerarquia} from 'src/app/models/jerarquia';
import {Colaborador} from 'src/app/models/colaborador';
import {RevisionDocumento} from 'src/app/models/revisiondocumento';
import {ValidateNested,MaxLength,MinLength,IsEmpty,ValidateIf,Min,Max,NotEquals,ArrayNotEmpty} from 'class-validator';
import {Codigo} from 'src/app/models/codigo';
import {RutaParticipante} from 'src/app/models/rutaParticipante';
import {Tipo,BandejaDocumento} from 'src/app/models';
import {Constante} from 'src/app/models/constante';
import {Critica} from "./critica";
import {Fase} from './fase';

export class Documento {
    /*borrar*/
    fechaApro: Date;
     vcoddocu:string;
    vdesdocu:string;
    idjerageneral:string;
    idjeralc:string;
     iproce:string;
     nrevision:string;
     nestrevision:string;
     nidocu:string;
     nidrevi:string;
     nidrevision:string;
     rutagerencia: string;
     rutalcance: string;
     rutaproceso: string;
    /*borrar*/
    tabName:string;
    id: number;
    idrevisionR:number;
    fechaCreaDoc: Date;  
    idcolaboracioncreaciondoc : number;
    revisionfecha: string;
    numeroderevision: number;
    codigo: string="";
    @MinLength(1, {message: 'Se requiere ingresar titulo de documento'})
    descripcion: string;
    padre: Documento;
    version: number;
    rutaDocumento?:string;
    rutaDocumentoCopiaObso?: string;
    urlDocumento?: string;
    responsable: string;
    estado: Parametro;
    retencionRevision: number;
    //proceso: Parametro[];
    proceso: string;
    alcanceSGI: string;
    gerencia: number;
   // gerencia1: string;
    //gerencia: Parametro;
    idrevision: string;
    ctipoDocumento: Parametro;
    fecha: Date;
    
    //Codigo			codigoAnterior;
    codigoAnterior: Codigo;
    justificacion: string;
    motivoRevision: Parametro;
    criticaporDocumento: RevisionDocumento = new RevisionDocumento();
    emisor: Colaborador;
    fase: Parametro;
    nombreArchivo: string;
    rutaArchivo: string;
    @ValidateIf(o => o.revision != null)
    @ValidateNested()
    revision: RevisionDocumento = new RevisionDocumento();
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
    @ArrayNotEmpty({message: "Se requiere agregar participante en la Elaboracion"})
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
    listaComplementario: Documento[];
    listaEquipo: Equipo[]; 

    /* Participantes*/ 
    listaParticipante: RutaParticipante[];

    //List<Revision>		listaRevision;
    listaRevision: RevisionDocumento[];
    listaDestinatario: RutaParticipante[];
    idHistorial: number;
    /**
     * 
     */n_motivo: string;
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
//cguerra
    indicadorequiRes: Equipo = new Equipo();
//cguerra
    tipoDocumento: string;
    coordinador: Colaborador;
    indicadorDigital: number;
    indAprobacionSoli: string;
    indicadorSolicitudRevision: string;
     critica: Critica;
    indicadorFase: string;
    indicadorAprobado: string;
    @ValidateIf(o => o.indicadorResponsable != null)
    @Min(1, {message: 'No se ha seleccionado Equipo Responsable'})
    indicadorResponsable:number;

    itemColumnaDoc :number;
    listaDocumento : Array<Documento>;


    @ValidateIf(o => o.indicadorParticipante != null)
    @Max(0, {message: 'Tiene participante(s) con informacion desactualizada'})
    indicadorParticipante:number;
    codigoAntiguo:string;
    idUsuAprobador?:string;
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
        this.indicadorDigital = 0;
        this.fechaCreaDoc = null;
        this.idcolaboracioncreaciondoc  = null;
        this.indAprobacionSoli = "";
        this.indicadorSolicitudRevision = null;
        this.indicadorFase = null;
        this.fase = new Parametro();
        this.indicadorAprobado = "0";
        this.coordinador = new Colaborador();
        this.indicadorResponsable = 0;
        this.itemColumnaDoc = 0;
        this.revisionfecha = "";
        this.listaDocumento =[];
        this.indicadorParticipante= 0;
        this.codigoAntiguo="";
        this.idUsuAprobador="";
    }
}