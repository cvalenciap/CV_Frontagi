
import {  IsNotEmpty, MinLength, ValidateIf, NotContains, NotEquals, MaxLength, Max} from 'class-validator';
export  class PreguntaDetalle{

    codPregunta:number;
    codDetalle:number;
    idDetalle:number;
    @IsNotEmpty({message: 'Se requiere ingresar un descripcion de una pregunta.'})
    descPregunta:string;
    datosAuditoria:string;
    @IsNotEmpty({message: 'Se requiere ingresar el valor de la respuesta'})
    valorRespuesta:string;
    @IsNotEmpty({message: 'Se requiere ingresar el valor de la disponibilidad'})
    disponibilidad:string;
    @IsNotEmpty({message: 'Se requiere ingresar el valor de la disponibilidad'})
    nomDisp:string;
    @IsNotEmpty({message: 'Se requiere ingresar el valor de la respuesta'})
    nomResp:string;

    constructor(){
        this.codPregunta=0;
        this.descPregunta="";
        this.idDetalle=0;
        this.datosAuditoria="";
        this.valorRespuesta="";
        this.codDetalle=0;
        this.disponibilidad="";
        this.nomDisp="";
        this.nomResp="";
    }
}