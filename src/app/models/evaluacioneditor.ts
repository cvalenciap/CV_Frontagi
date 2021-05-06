import { Auditoria } from "./auditoria";
import { Colaborador } from "./colaborador";

 
   
export class EvaluacionEditor{
    idEvaluacionAuditor: number;
    idAuditoria: string;
    descripcion: string;
   
    fauditoria: string;
   

    auditorEvaluado: string;
    numeroFicha: string;
    apellidoPat:string;
    apellidoMat:string;
    nombre:string;

    rol: string;

    

    nroAuditoria:string;

     auditoria:Auditoria;
     colaborador:Colaborador;

    usuarioCreador:string;

    idPregAudi:number;
    idEvaluadi:number;
    respuestaNivelPreg:string; 
    estado:string;
    descripcionPregunta:string;

    totalHoras:number;

    constructor(){
         
        this.idEvaluacionAuditor=0;
       
        this.nroAuditoria="";
        this.idAuditoria = "";
        this.descripcion="";
       
        this.fauditoria = "";
        this.auditorEvaluado = "0";
        this.numeroFicha="";
        this.apellidoPat="";
        this.apellidoMat="";
        this.nombre="";
        this.rol = "";

        this.idPregAudi=0;
        this.idEvaluadi=0;
        this.usuarioCreador="";
        this.respuestaNivelPreg=";"
        this.estado="";
        this.descripcionPregunta="";

        this.auditoria=new Auditoria();
        this.colaborador=new Colaborador();
        this.totalHoras=0;
      
    }  
}