import { ConsideracionPlan } from "./consideracionesplan";
import { CriterioResultado } from "./criterioResultado";
import { DatosAuditoria } from "./datosAuditoria";
import { Norma } from "./norma";
import { RequisitoAuditoriaRegistro } from "./requisitoauditoriaregistro";
import { Programa } from "./programa";

export class Auditoria{
    idAuditoria:number;
    estadoAuditoria:string;
    descripcionEstadoAuditoria:string;//agregado
    mes:string;
    /*
    usuarioCreacion:string;
    fechaCreacion:Date;
    usuarioModificacion:string;
    fechaModificacion:Date;
    */
    idPrograma:number;
    gerencia:string;
    equipo:string;
    cargo:string;
    comite:string;
    descripcionEntidad:string;//agregado
    tipoAuditoria:string;
    descripcionTipoAuditoria:string;//agregado
    fechaInicio:Date;
    fechaFin:Date;
    textoFechaInicio:string;//agregado
    textoFechaFin:string;//agregado
    descripcionAuditoria:string;
    objetivo:string;
    alcance:string;
    idColaborador:string;
    rechazoAuditoria:string;
    listaNormas:Norma[];
    descripcionNorma:string;//agregado
    descripcionMes:string;//agregado
    idObservador:string;
    anio:number;//agregado
    cicloAuditoria:string;

    datosAuditoria:DatosAuditoria;

    listaCriterios:CriterioResultado[];
    listaConsideracionesPlan:ConsideracionPlan[];
    listaDetalle:RequisitoAuditoriaRegistro[];

    nroAuditoria:string;

    programa:Programa;

    auditorLider:string;
    observadorLiderGrupo:string;

    constructor(){
        this.estadoAuditoria="";
        //this.descripcionEstadoAuditoria="";
        this.mes="";
        this.gerencia = "";
        this.equipo = "";
        this.cargo = "";
        this.comite = "";
       // this.descripcionEntidad = "";
        this.tipoAuditoria = "";
        this.descripcionTipoAuditoria = "";
        this.descripcionAuditoria = "";
        this.objetivo = "";
        this.alcance = "";
        this.rechazoAuditoria = "";
        this.listaNormas = [];
        this.descripcionNorma = "";
        this.descripcionMes = "";
        this.listaCriterios = [];
        this.listaConsideracionesPlan = [];
        this.idColaborador = "";
        this.idObservador = "";
        this.datosAuditoria = null;
    }
}