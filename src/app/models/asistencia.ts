import { Sesion } from "src/app/models/sesion";
import { EmpleadoAsistencia } from "src/app/models/empleadoAsistencia";



export  class Asistencia{

    idCurso:string;
    codCapacitacion:string;
    codCurso:string;
    nomCurso:string;
    nomInstructor:string;
    numParticipantes:string;
    idCapacitacion:number;
    listSesion:Sesion[];
    listTrabajador:EmpleadoAsistencia[];
    idColaborador:string;
    idSesion:string;
    justificacion:string;
    asistencia:number;
    paginacion: any;
    nombreArchivo:string;
    descEliminar:string;
    idExamen:string;
    nota:"";
    indAsistencia: number;
    dispAsistencia: number;
    estCapacitacion: string;
    archivoAntiguo:string;
    constructor(){
        this.idCurso="";
        this.codCapacitacion="";
        this.codCurso="";
        this.nomCurso="";
        this.nomInstructor="";
        this.numParticipantes="";
        this.listSesion=[];
        this.listTrabajador=[];
        this.idColaborador="";
        this.idSesion="";
        this.justificacion="";
        this.asistencia=0;
        this.nombreArchivo="";
        this.descEliminar="";
        this.idExamen="";
        this.nota="";
        this.archivoAntiguo="";
    }

}