export class RelacionCoordinador {
    idRelacion: number;
    idGerencia: number;
    idAlcance: number;
    idCoordinador: number;
    descripcionGerencia: string;
    descripcionAlcance: string;
    nombreCompletoCoordinador: string;
    nroFicha: number;
    indicadorDocumento: number;
    descripcionIndicador: string;
    estadoRegistro: string;
    indicadorSinAlcance: number;

    constructor(){
        this.idRelacion = 0;
        this.idGerencia = 0;
        this.idAlcance = 0;
        this.idCoordinador = 0;
        this.descripcionGerencia = "";
        this.descripcionAlcance = "";
        this.nombreCompletoCoordinador = "";
        this.nroFicha = 0;
        this.indicadorDocumento = 0;
        this.descripcionIndicador = "";
        this.estadoRegistro = "";
        this.indicadorSinAlcance = 0;
    }
}