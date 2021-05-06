import { Norma } from "./norma";
import { Mes } from "./mes";

export class DetalleProgramacionRegistro{
    valorTipoEntidad:string;
    valorEntidadGerencia:any;
    valorEntidadEquipo:any;
    valorEntidadCargo:any;
    valorEntidadComite:any;
    listaMeses:any[];
    listaNormas:Norma[];

    constructor(){
        this.valorTipoEntidad = "0";
        this.valorEntidadGerencia = "";
        this.valorEntidadEquipo = "";
        this.valorEntidadCargo = "";
        this.valorEntidadComite = "";
        this.listaMeses = [];
        this.listaNormas = [];
    }
}