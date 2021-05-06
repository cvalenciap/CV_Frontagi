export class RegistroAuditor {
    codigo: number;
    numFicha: string;
    nombreAuditor: string;
    apePaternoAuditor: string;
    apeMaternoAuditor: string;
    tipo: number;
    nomTipo: string;
    codigoRolAuditor: number;
    nomRol: string;

    constructor(numFicha: string , nombreAuditor: string, apePaternoAuditor: string, apeMaternoAuditor: string, tipo: number, nomTipo: string, codigoRolAuditor: number, nomRol: string){
        this.numFicha =numFicha;
        this.nombreAuditor = nombreAuditor;
        this.apePaternoAuditor=apePaternoAuditor;
        this.apeMaternoAuditor=apeMaternoAuditor;
        this.tipo= tipo;
        this.nomTipo = nomTipo;
        this.codigoRolAuditor= codigoRolAuditor;
        this.nomRol= nomRol;
    }
}
