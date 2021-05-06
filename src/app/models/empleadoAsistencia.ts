import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { DatosAuditoria } from 'src/app/models/datosAuditoria';
import { List } from 'lodash';
import {  IsNotEmpty, MinLength, ValidateIf, NotContains, NotEquals, MaxLength, Max} from 'class-validator';

export  class EmpleadoAsistencia{

    nombreTrabajador:string;
    idCapacitacion:number;
    idEquipo:string;
    idSesion:string;
    idCurso:string;
    nomEquipo:string;
    idEstadoAsistencia:string;
    descripAsistencia:string;
    @IsNotEmpty({message: 'Se requiere ingresar una justificación.'})
    justificacion:string;
    itemColumna:number;
    seleccionado:number;
    nomCurso:string;
    idTrabajador:string;
    valor:number;
    rutaDocumento:any;
    nomDocumento:string;
    @IsNotEmpty({message: 'Se requiere seleccionar un Documento PDF.'})
    nombreArchivo:string;
    archivoAntiguo:string;
    descEliminar:string;
    desactivar:boolean;
    nota:string;
    tipoEvaluacion:string;
    estadoEvaluacion:string;
    idExamen:string;
    indEnvio : number;
    constructor(){
        this.nombreTrabajador="";
        this.idCapacitacion=0;
        this.idEquipo="";
        this.idSesion="";
        this.idCurso="";
        this.nomEquipo="";
        this.idEstadoAsistencia="";
        this.descripAsistencia="";
        this.justificacion="";
        this.itemColumna=0;
        this.seleccionado=0;
        this.nomCurso="";
        this.idTrabajador="";
        this.valor=null;
        this.nombreArchivo="";
        this.nomDocumento="";
        this.archivoAntiguo="";
        this.descEliminar="";
        this.desactivar=false;
        this.nota="";
        this.tipoEvaluacion="";
        this.estadoEvaluacion="";
        this.idExamen="";
        this.indEnvio = 0;
    }
}