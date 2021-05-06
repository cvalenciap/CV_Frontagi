import { Requisito } from "./requisito";
import { Trabajador } from "./trabajador";


export class DeteccionHallazgos{
    idDeteccionHallazgo: string;
    idorigenDeteccion: string;
    valorAmbito:string;
    ambito: string;
    origenDeteccion: string;
    fechaDeteccion: Date;

    detector: Trabajador;
   
    estado: string;


    idTipoNoConformidad:string;
    tipoNoConformidad:string;
    descripHallazgo:string;

    valorTipoEntidad:string;

    norma:string;
    gerencia:string;
    equipo:string;
    responsable:string;

    valorEntidadGerencia:string;
    valorEntidadEquipo:string;

    nombreDetector:string;
    apPaternoDetector:string;
    apMaternoDetector:string;

    requisito:Requisito;
    



    constructor(){
        
        this.idorigenDeteccion="";
        this.valorAmbito="";
        this.estado = "";
        this.idTipoNoConformidad="";
        this.norma="";

        this.valorEntidadGerencia = "";
        this.valorEntidadEquipo = "";
        this.valorTipoEntidad = "0";

        this.detector = new Trabajador();
      
    }  
}