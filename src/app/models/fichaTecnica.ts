import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { IsNotEmpty, IsInt, Min, NotEquals, MinLength } from 'class-validator';
import { FichaTecnicaDocumento } from 'src/app/models/fichadocumento';

export class FichaTecnica {
    id: number;
    @IsInt({message: 'Se requiere ingresar Tipo de Proceso valido'})
    @Min(1, {message: 'Se requiere ingresar Tipo de Proceso'})
    // @NotEquals("0", {message: 'Se requiere ingresar Tipo de Proceso'})
    idTipoProceso: number;
    tipoProceso: string;
    @IsInt({message: 'Se requiere ingresar Nivel valido'})
    @Min(1, {message: 'Se requiere ingresar Nivel'})
    idNivel: number;
    nivel: string;
    @IsNotEmpty({message: 'Debe ingresar Descripción'})
    proceso: string;
    @IsInt({message: 'Se requiere ingresar Responsable valido'})
    @Min(1, {message: 'Se requiere ingresar Responsable'})
    idResponsable: number;
    responsable: string;
    @IsNotEmpty({message: 'Debe ingresar Objetivo'})
    objetivo: string;
    @IsNotEmpty({message: 'Debe ingresar Alcance'})
    alcance: string;
    @IsNotEmpty({message: 'Debe ingresar Requisito'})
    requisitos: string;
    proveedores: string;
    entradas: string;
    subProceso: string;
    salidas: string;
    clientes: string;
    personal: string;
    equipos: string;
    materiales: string;
    nombreGrafico:string;
    rutaGrafico:string;
    ambientes: string;
    documentosAplicado: string;
    controles: string;
    registros: string;
    indicadores: string;
    idElaborado: number;
    elaborado: string;
    idAprobado: number;
    aprobado: string;
    idConsensado: number;
    consensado: string;
    //estado: EstadoConstante;
    //disponible: BigDecimal;

    tipo: Tipo;
    estado: Estado;

    /* YPM - INICIO */
    idJera: number;
    fichaTecnicaDocumento: FichaTecnicaDocumento[];
    /* YPM - FIN */

    /*codigo: number;
    descripcion: string;
    fecha: Date;  
    responsable: string;*/
  
  constructor(){
    this.tipo = new Tipo();
    this.tipo.codigo = "";
    this.tipo.descripcion = "";
    this.estado = Estado.ACTIVO;

    this.id = 0;
    this.idTipoProceso = 0;
    this.tipoProceso = "";
    this.idNivel = 0;
    this.nivel = "";
    this.proceso = "";
    this.idResponsable = 0;
    this.responsable = "";
    this.objetivo = "";
    this.alcance  ="";
    this.requisitos = "";
    this.proveedores = "";
    this.nombreGrafico ="";
    this.rutaGrafico="";
    this.entradas  = "";
    this.subProceso = "";
    this.salidas = "";
    this.clientes = "";
    this.personal = "";
    this.equipos = "";
    this.materiales = "";
    this.ambientes  = "";
    this.documentosAplicado = "";
    this.controles = "";
    this.registros = "";
    this.indicadores = "";
    this.idElaborado = 0;
    this.elaborado = "";
    this.idAprobado = 0;
    this.aprobado = "";
    this.idConsensado = 0;
    this.consensado = "";

    /*this.tipo = new Tipo();
    this.tipo.codigo = "";
    this.tipo.descripcion = "";
    this.estado = Estado.ACTIVO;

    this.descripcion = "";
    this.codigo = 0;
    this.fecha = new Date();
    this.responsable = "";*/

    /* YPM - INICIO */
    this.idJera = 0;
    this.fichaTecnicaDocumento = [];
    /* YPM - FIN */
  }
}





