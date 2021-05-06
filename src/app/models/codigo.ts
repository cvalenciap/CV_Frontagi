import { Estado } from "src/app/models/enums";

export class Codigo {

    id: number;
	codigo: string;
	motivo: string;
	estado: Estado;
	idHistorial: number;
	disponible: string;

    constructor(){
    }
}