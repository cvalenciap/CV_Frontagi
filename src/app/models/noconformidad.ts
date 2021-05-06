import { List } from "lodash";

// Interface para las no conformidades
export class NoConformidad{
    idNoConformidad : string;
    fechaIdentificacion : string;
    idTipoNoConformidad : string;
    descripcionTipoNoConformidad : string;
    idGerencia : string;
    descripcionGerencia : string;
    idNorma : string;
    descripcionNorma : string;
    descripcionAlcance : string;
    idOrigenDeteccion : string;
    descripcionOrigenDeteccion : string;
    idRequisito : string;
    descripcionRequisito : string;
    idEquipo : string;
    descripcionEquipo : string;
    idTipoAmbito : string;
    descripcionTipoAmbito : string;
    idEtapa : string;
    descripcionEtapa : string;
    idEstadoNoConformidad : string;	
    descripcionEstadoNoConformidad : string;
    descripcionIdentifProblema:string;
    descripcionAccionInmediata: string ;
	descripcionObservacion: string;
	descripcionAnalisisCausa: string;
	criticaAnalisisCausa: string;
	criticaAccionInmediata : string;
    comentarioVerificacion: string;
    comentarioCierre: string;
    archivoAdjuntoProblema:File;
    archivoAdjuntoObservacion:File;
    archivoAdjuntoAnalisis:File;
    archivoAdjuntoEjecucion:File;
    numeroTab:number;
    indicadorUsuario: number;

    listaIdentificacionProblema:NoConformidad[];
    listaObservacionAnalisis:NoConformidad[];
    listaPlanAccion:NoConformidad[];
    listaEjecucion:NoConformidad[];
    listaVerificacionEstandarizacion:NoConformidad[];
    listaCierre:NoConformidad[];

    constructor(){
        this.idNoConformidad = "";
        this.fechaIdentificacion = "";
        this.idTipoNoConformidad = "";
        this.descripcionTipoNoConformidad = "";
        this.idGerencia = "";
        this.descripcionGerencia = "";
        this.idNorma = "";
        this.descripcionNorma = "";
        this.descripcionAlcance = "";
        this.idOrigenDeteccion = "";
        this.descripcionOrigenDeteccion = "";
        this.idRequisito = "";
        this.descripcionRequisito = "";
        this.idEquipo = "";
        this.descripcionEquipo = "";
        this.idTipoAmbito = "";
        this.descripcionTipoAmbito = "";
        this.idEtapa = "";
        this.descripcionEtapa = "";
        this.idEstadoNoConformidad = "";	
        this.descripcionEstadoNoConformidad = "";
        this.descripcionIdentifProblema="";
        this.descripcionAccionInmediata = "";
        this.descripcionObservacion = "";
        this.descripcionAnalisisCausa = "";
        this.criticaAnalisisCausa = "";
        this.criticaAccionInmediata = "";
        this.comentarioVerificacion = "";
        this.comentarioCierre = "";
        this.numeroTab = 0;
        this.indicadorUsuario = 0;
        /*this.listaIdentificacionProblema = [];
        this.listaObservacionAnalisis = [];
        this.listaPlanAccion = [];
        this.listaEjecucion = [];
        this.listaVerificacionEstandarizacion = [];
        this.listaCierre = [];*/
    }
}