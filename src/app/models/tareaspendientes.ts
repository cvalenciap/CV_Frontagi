export class TareasPendientes {
    idColaborador: number;
	cantidadParaRevision: number;
	cantidadParaCancelar: number;
	cantidadParaImprimir: number;
	cantidadElaboracion: number;
	cantidadConsenso: number;
	cantidadAprobacion: number;
    cantidadHomologacion: number;
    cantidadCancelacion: number;
    cantidadCambioPersonal: number;
    cantidadRealizarRevision: number;

    constructor(){
        this.idColaborador = 0;
        this.cantidadParaRevision = 0;
        this.cantidadParaCancelar = 0;
        this.cantidadParaImprimir = 0;
        this.cantidadElaboracion = 0;
        this.cantidadConsenso = 0;
        this.cantidadAprobacion = 0;
        this.cantidadHomologacion = 0;
        this.cantidadCancelacion = 0;
        this.cantidadCambioPersonal = 0;
        this.cantidadRealizarRevision = 0;
    }
  }