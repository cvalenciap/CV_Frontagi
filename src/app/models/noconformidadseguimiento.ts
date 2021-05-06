// YPM
export class NoConformidadSeguimiento{
    ordenEtapa: string;	
	idNoConformidad: string;
	idNoConformidadSeguimiento: string;
	etapaSeguimiento: string;
	fechaseguimiento: string;
    estadoSeguimiento: string;
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion: string;
    fechaModificacion: string;
    etapa:string;
    numeroFila:number;
    constructor(){
        this.ordenEtapa = "";	
        this.idNoConformidad = "";
        this.idNoConformidadSeguimiento = "";
        this.etapaSeguimiento = "";
        this.fechaseguimiento = "";
        this.estadoSeguimiento = "";  
        this.usuarioCreacion = "";
        this.fechaCreacion = "";
        this.usuarioModificacion = "";
        this.fechaModificacion = "";
        this.etapa="";
        this.numeroFila=0;
    }
}