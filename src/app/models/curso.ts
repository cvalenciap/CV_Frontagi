import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { Sesion } from 'src/app/models/sesion';
import { Area } from 'src/app/models/area';
import { Equipo } from 'src/app/models/equipo';
import { CursoEquipo } from 'src/app/models/cursoEquipo';
import { MinLength, ValidateIf, NotContains, IsInt, Min, Max } from 'class-validator';

export class Curso {
    idCurso: string;
    @MinLength(1, {message: 'Se requiere Nombre de Curso'})
    nombreCurso: string;
    @ValidateIf(o =>  o.indicadorSGI == 0 || typeof(o.indicadorSGI) == "string")
    @MinLength(1,{message: 'Se requiere seleccionar Indicador SGI'})
    @NotContains("3",{message: 'Se requiere seleccionar Indicador SGI'})
    indicadorSGI: string;
    @ValidateIf(o =>  o.disponibilidad == 0 || typeof(o.disponibilidad) == "string")
    @MinLength(1,{message: 'Se requiere seleccionar Disponibilidad del Curso'})
    @NotContains("3",{message: 'Se requiere seleccionar Disponibilidad del Curso'})
    disponibilidad: string;
    @MinLength(1, {message: 'Se requiere Código de Curso'})
    codigoCurso: string;
  /*   @ValidateIf(o =>  o.tipoCurso == 0 || typeof(o.tipoCurso) == "string")
    @MinLength(1,{message: 'Se requiere seleccionar un Tipo de Curso'})
    @NotContains("0",{message: 'Se requiere seleccionar un Tipo de Curso'}) */
    tipoCurso: string;
    sesiones: string;
    codigo: string;
    nombre: string;
    tipo: string;
    @IsInt()
    @Min(1,{message:'El curso debe tener una duración mayor a 0 horas'})
    @Max(99,{message:'El máximo de horas para un curso es de 99 horas'})
    duracion:string;
    indicador:string;
    disponible:String;
    cantidad: number;
    descripcion: string;    
    estado: Estado;
    fechaRegistro: Date;
    responsable: string;
    fechaString: String;
    listaSesiones: Array<Sesion>;
    lstArea: Array<Area>;
    listaEquipo: Array<Equipo>;
    idSesion: string;
    estadoRegistro: string;
    listaAreas: Array<Equipo>;
    descTipo: string;
    descDisp: string;
    constructor(){
        // this.tipo = "";      
        // this.codigo = "";
        // this.nombre = "";
        // this.descripcion = "";      
        this.tipoCurso = "0";
        this.estado = Estado.ACTIVO;
        this.indicadorSGI = "3";
        //this.fechaRegistro = new Date();
        //this.fecha = new Date();
        this.responsable = "";
        this.listaSesiones = [];
        this.lstArea = [];
        this.disponibilidad = "3";
        this.duracion = "";
        this.idSesion = "";
        this.estadoRegistro = "";
        this.listaEquipo = [];
        this.listaAreas = [];
        this.descTipo = "";
        this.descDisp = "";
    }
}

