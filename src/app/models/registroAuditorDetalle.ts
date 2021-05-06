export class RegistroAuditorDetalle {
    codAuditor: number;
    codTipoAuditor: number;
    codRolAuditor: number;
    nombre: string;    
    apePaterno: string;    
    apeMaterno: string;        
    codEducAuditor: number;
    experLaboral:String;
    tiempoExperLaboral : String;
    numFicha : String;
    numRol: string;
    cargo: string;

    constructor(){
        this.codAuditor = 0;
        this.codTipoAuditor = 0;
        this.codRolAuditor=0;
        this.nombre= "";
        this.apePaterno = "";
        this.apeMaterno= "";       
        this.codEducAuditor=0;
        this.experLaboral="";
        this.tiempoExperLaboral="";
        this.numFicha="";
        this.numRol="";
    }
}