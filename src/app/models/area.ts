export class Area {
  idArea: string;
  idCentro: string;
  descripcion: string;
  abreviatura: string;
  anexo: string;
  tipoArea: string;
  idAreaSuperior: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  responsable: string;
  idRevision: number;
  indicadorResponsable: number;
  idCurso: string;
  disponibilidad: string;
  estadoRegistro: string;
  // abreviatura: string;
  codigoCurso: string;
  constructor() {
    this.idArea = "";
    this.idCentro = "";
    this.descripcion = "";
    this.abreviatura = "";
    this.anexo = "";
    this.tipoArea = "";
    this.idAreaSuperior = "";
    this.fechaCreacion = "";
    this.fechaActualizacion = "";
    this.responsable = "";
    this.indicadorResponsable = 0;
    this.idCurso = "";
    this.disponibilidad = "";
    this.estadoRegistro = "";
  }
}
