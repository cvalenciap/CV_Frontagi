import { ConsideracionPlan } from "./consideracionesplan";

export class RegistroConsideracion{
    listaConsideracion:ConsideracionPlan[];
    listaConsideracionAuxiliar:ConsideracionPlan[];

    constructor(){
        this.listaConsideracion = [];
        this.listaConsideracionAuxiliar = [];
    }
}