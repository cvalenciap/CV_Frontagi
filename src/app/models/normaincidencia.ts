

export class NormaIncidencia{
    id: string;
    tipo: string;
    descripcionNormaIncidencia: string;
    numeroRequisito: string;
    requisitoIncidencia: string;
    normaRelacionada: string;
    numeroRequisitoRelacionado: string;
    descripcionRequisitoRelacionado: string;
    
    constructor(){
     
        this.id = "0";
        this.tipo = "";
        this.descripcionNormaIncidencia = "0";
        this.numeroRequisito = "";
        this.requisitoIncidencia = "";
        this.normaRelacionada = "";
        this.numeroRequisitoRelacionado = "";
        this.descripcionRequisitoRelacionado = "";
      
    }  
}