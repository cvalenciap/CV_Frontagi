import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { DatosAuditoria } from 'src/app/models/datosAuditoria';
import { List } from 'lodash';
import { PreguntaDetalle } from 'src/app/models/preguntadetalle';
import {  IsNotEmpty, MinLength, ValidateIf, NotContains, NotEquals, MaxLength, Max} from 'class-validator';

export  class PreguntaCurso{
    @IsNotEmpty({message: 'Se requiere ingresar una codigo de un curso.'})
    codCurso:string;
   
    codPregunta?:string;
    @IsNotEmpty({message: 'Se requiere ingresar una descripción de la pregunta, este campo admite un maximo de 100 caracteres'})
    @MaxLength(100, {message: 'Se requiere ingresar una descripción de pregunta valida, este campo admite un maximo de 100 caracteres'})
    pregunta:string;
    @IsNotEmpty({message: 'Se requiere ingresar el tipo de pregunta'})
    tipo?:string;

    @IsNotEmpty({message: 'Se requiere ingresar el puntaje'})
    puntaje:string;
    disponibilidad?:string;
    @IsNotEmpty({message: 'Se requiere ingresar nombre del Curso.'})
    nomCurso?:string;
    estado: Estado;
    @IsNotEmpty({message: 'Se requiere ingresar el valor de la respuesta.'})
    valorRespuesta:number;
    datosAuditoria:DatosAuditoria;
    listPregunta:PreguntaDetalle[];
    idCurso:string;
	disponibilidadCurso:string;
    idTipoCurso:string;
    nomTipo:string;

    descTipoCurso?:string;
    

    idCapacitacion:number;
    idPregunta: number;
    itemColPreg: number;
    disPregCapa?: number;

    constructor(){
        this.codCurso="";
        this.codPregunta="";
        this.pregunta="";
        this.tipo="";
        this.puntaje="0";
        this.disponibilidad="";
        this.nomCurso="";
        this.listPregunta=[];
        this.valorRespuesta=0;
        this.idCurso="";
        this.disponibilidadCurso="";
        this.idTipoCurso="";
        this.nomTipo="";

        this.descTipoCurso="";

        this.idCapacitacion = 0;
        this.idPregunta  =0;
        this.itemColPreg = 0;
        this.disPregCapa = 0;

    }
}