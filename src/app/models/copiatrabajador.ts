export class CopiaTrabajador {
    idDocumento: number;
    idFase: number;
    fase: string;
    idTrabajador: number;
    nroFicha: number;
    nombre: string;
    apellidoParterno: string;
    apellidoMaterno: string;
    cargo: string;
    idArea: number;
    area: string;
    estadoTrabajador: string;
    estadoRegistro: string;
    tipoCambio: string;

    constructor(){
        this.fase = "";
        this.nombre = "";
        this.apellidoParterno = "";
        this.apellidoMaterno = "";
        this.cargo = "";
        this.area = "";
        this.estadoTrabajador = "";
        this.estadoRegistro = "";
        this.tipoCambio = "";
    }
}