import { Curso } from "src/app/models/curso";
import { MinLength, ValidateIf, NotContains, IsInt, Min, Max } from "class-validator";
import { EmpleadoAsistencia } from "src/app/models/empleadoAsistencia";
import { Aula } from "src/app/models/aula";

export class Sesion {
     idSesion: string;
     idCurso: string;
    // fechaSesion: string;
    duracion: string;
    @ValidateIf(o =>  o.disponibilidad == 0 || typeof(o.disponibilidad) == "string")
    @MinLength(1,{message: 'Se requiere seleccionar Disponibilidad de la Sesión'})
    @NotContains("3",{message: 'Se requiere seleccionar Disponibilidad de la Sesión'})
    disponibilidad: string;
    estadoRegistro: string;
    item: number;
    itemColumna: number; 
    fechaSesion: Date;
    fechaInicio: Date;
    fechaFin: Date;
    horaInicio: string;
    horaFin: string;
    // horaInicio: string;
    // horaFin: string;
    @MinLength(1, {message: 'Se requiere Nombre de Sesión'})
    nombreSesion: string;
    curso: Curso;
    descDisp: string;
    listTrabajador:EmpleadoAsistencia[];
    listEmpleado:EmpleadoAsistencia[];
    idCapacitacion:number;
    nomCurso:string;
    idAula: string;
    nombreAula: string;

    constructor(){
         this.idSesion = "";
         this.idCurso = "";
        // this.fechaSesion = "";
        this.duracion = "";
        this.disponibilidad = "3";
        // this.fechaSesion = "";
        // this.horaInicio = "";
        // this.horaFin = "";
        this.nombreSesion = "";
        this.item = 0;
        this.itemColumna =0;
        this.estadoRegistro = "";
        this.descDisp = "";
        this.listEmpleado=[];
        this.idCapacitacion=0;
        this.listTrabajador=[];
        this.nomCurso="";
        this.fechaSesion = null;
        this.horaInicio = null;
        this.horaFin = null;
        this.fechaFin = null;
        this.fechaInicio = null;
        this.idAula = "";
        this.nombreAula = "";
    }

}