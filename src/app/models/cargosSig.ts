export class CargosSig {
    nombre: string;
    sigla: string;
    colaborador: string;
    codAuditor: string;

    constructor(nombre: string, sigla: string, colaborador: string) {
        this.nombre = nombre;
        this.sigla = sigla;
        this.colaborador = colaborador;
    }
}