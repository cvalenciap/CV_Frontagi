import {  IsNotEmpty, MinLength, ValidateIf, NotContains, NotEquals, MaxLength, Max} from 'class-validator';

export class Pregunta{
    iD: number;
    pregunta: string;
    @IsNotEmpty({message: 'Se requiere ingresar una pregunta, este campo admite un maximo de 100 caracteres'})
    @MaxLength(100, {message: 'Se requiere ingresar una descripción de aula valida, este campo admite un maximo de 100 caracteres'})


    auditorLider: string;
    auditorLiderInterno: string;
    auditorInterno: string;
    auditorObservador:string;
    estado: number;
    rNum: number;
    total: number;
    radioNum:string;
    vRolAuditor:string;
    listaRoles:any[];
    
    
    constructor(){     
        this.iD = 0;  
        this.pregunta = "";
        this.auditorLider = "0";
        this.auditorLiderInterno = "0";    
        this.auditorInterno = "0"; 
        this.auditorObservador="0"; 
        this.estado = 1;
        this.rNum=1;
        this.radioNum;
        this.vRolAuditor="";    
    }  
}
