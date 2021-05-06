import { MinLength, IsNotEmpty, ValidateIf } from "class-validator";

export class ParametrosRevision {
    codigoDoc:string;
    tituloDoc:string;
    //@MinLength(1,{message:'Es necesario el campo fecha inicio'})
    @ValidateIf(o => o.fechaFinal)
    @IsNotEmpty({message:'Si ingresastes fecha registro final, ingresa fecha inicio'})
    fechaInicio:string;
    @ValidateIf(o => o.fechaInicio)
    @IsNotEmpty({message:'Si ingresastes fecha registro inicio, ingresa fecha final'})
    fechaFinal:string;
    tabName:string;
    
}