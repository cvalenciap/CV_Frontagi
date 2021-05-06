import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { Sede } from 'src/app/models/sede';
import {  IsNotEmpty, MinLength, ValidateIf, NotContains, NotEquals, MaxLength, Max} from 'class-validator';

export class Aula {
//jgodos
nidaula: number;
@IsNotEmpty({message: 'Se requiere ingresar una descripción de aula valida, este campo admite un maximo de 100 caracteres'})
@MaxLength(100, {message: 'Se requiere ingresar una descripción de aula valida, este campo admite un maximo de 100 caracteres'})
vnomaula: string;
@IsNotEmpty({message: 'Se requiere ingresar la capacidad del aula'})
@NotEquals("0", {message: 'Se requiere ingresar la capacidad diferente a cero'})
ncapaula: number = 0;
@IsNotEmpty({message: 'Se requiere ingresar la sede del aula'})
nidsede: number;
@IsNotEmpty({message: 'Se requiere ingresar un código de aula valido, este campo admite un maximo de 20 caracteres'})
@MaxLength(20, {message: 'Se requiere ingresar un código de aula valido, este campo admite un maximo de 20 caracteres'})
vcodaula:string;
@IsNotEmpty({message: 'Se requiere ingresar la disponibilidad del aula'})
ndisaula:number;
ad_feccre:Date;
avusumod:string;
ad_fecmod:Date;
avnomprg:string;
avusucre:string;

vnomsede:string;


constructor(){
    this.nidaula = 0;
    this.vnomaula='';
    this.ncapaula= 0;
    this.vcodaula='';
}
}

