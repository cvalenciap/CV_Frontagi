import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class Instructor {
    n_idinst: number;
    @IsNotEmpty({message: 'Se requiere ingresar la disponibilidad del instructor'})
    n_disinst: number;
    v_nominst: string;
    a_v_usucre: string;
    a_d_feccre: Date;
    a_v_usumod: string;
    a_d_fecmod: Date;
    a_v_nomprg: string;
    @IsNotEmpty({message: 'Se requiere el tipo de instructor'})
    v_tipinst: string;
    @IsNotEmpty({message: 'Se requiere ingresar el número de ficha del instructor'})
    v_codinst: string;
    
    v_apepatinst: string;
    v_apematinst: string;
    v_tipdocinst: string;
    v_numdocinst: string;

    tipobusq: string;
    v_nomcomp: string;
    constructor(){
        this.v_codinst = null;
        this.v_nominst= null;
        this.v_apepatinst= null;
        this.v_apematinst= null;
        this.v_nominst= null;
        this.tipobusq= null;
    }
}


